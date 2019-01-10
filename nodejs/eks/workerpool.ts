// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as crypto from "crypto";
import * as jsyaml from "js-yaml";

import { VpcCni } from "./cni";
import { ServiceRole } from "./servicerole";
import transform from "./transform";

/**
 * RoleMapping describes a mapping from an AWS IAM role to a Kubernetes user and groups.
 */
export interface RoleMapping {
    /**
     * The ARN of the IAM role to add.
     */
    roleArn: pulumi.Input<aws.ARN>;

     /**
     * The user name within Kubernetes to map to the IAM role. By default, the user name is the ARN of the IAM role.
     */
    username: pulumi.Input<string>;

     /**
     * A list of groups within Kubernetes to which the role is mapped.
     */
    groups: pulumi.Input<pulumi.Input<string>[]>;
}

 /**
 * UserMapping describes a mapping from an AWS IAM user to a Kubernetes user and groups.
 */
export interface UserMapping {
    /**
     * The ARN of the IAM user to add.
     */
    userArn: pulumi.Input<aws.ARN>;

     /**
     * The user name within Kubernetes to map to the IAM user. By default, the user name is the ARN of the IAM user.
     */
    username: pulumi.Input<string>;

     /**
     * A list of groups within Kubernetes to which the user is mapped to.
     */
    groups: pulumi.Input<pulumi.Input<string>[]>;
}

/**
 * WorkerPoolOptions describes the configuration options accepted by a WorkerPool component.
 */
export interface WorkerPoolOptions {
    /**
     * The VPC in which to create the worker pool.
     */
    vpcId: pulumi.Input<string>;

    /**
     * The IDs of the cluster subnets to filter for worker pool subnet ids.
     *
     * If the list of subnets includes both public and private subnets, the Kubernetes API
     * server and the worker nodes will only be attached to the private subnets. See
     * https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html for more details.
     */
    clusterSubnetIds: pulumi.Input<string[]>;

    /**
     * The IDs of the explicit node subnets to attach to the worker pool.
     *
     * This option overrides clusterSubnetIds option.
     */
    nodeSubnetIds?: pulumi.Input<pulumi.Input<string>[]>;

    /**
     * Optional mappings from AWS IAM roles to Kubernetes users and groups.
     */
    roleMappings?: pulumi.Input<pulumi.Input<RoleMapping>[]>;

     /**
     * Optional mappings from AWS IAM users to Kubernetes users and groups.
     */
    userMappings?: pulumi.Input<pulumi.Input<UserMapping>[]>;
    /**
     * The security group associated with the EKS cluster.
     */
    clusterSecurityGroup: aws.ec2.SecurityGroup;

    /**
     * The target EKS cluster.
     */
    cluster: aws.eks.Cluster;

    /**
     * The instance type to use for the cluster's nodes. Defaults to "t2.medium".
     */
    instanceType?: pulumi.Input<aws.ec2.InstanceType>;

    /**
     * The instance role to use for all nodes in this workder pool.
     */
    instanceRole?: pulumi.Input<aws.iam.Role>;

    /**
     * The security group to use for all nodes in this workder pool.
     */
    nodeSecurityGroup?: aws.ec2.SecurityGroup;

    /**
     * Public key material for SSH access to worker nodes. See allowed formats at:
     * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html
     * If not provided, no SSH access is enabled on VMs.
     */
    nodePublicKey?: pulumi.Input<string>;

    /**
     * The size in GiB of a cluster node's root volume. Defaults to 20.
     */
    nodeRootVolumeSize?: pulumi.Input<number>;

    /**
     * Extra code to run on node startup. This code will run after the AWS EKS bootstrapping code and before the node
     * signals its readiness to the managing CloudFormation stack. This code must be a typical user data script:
     * critically it must begin with an interpreter directive (i.e. a `#!`).
     */
    nodeUserData?: pulumi.Input<string>;

    /**
     * The number of worker nodes that should be running in the cluster. Defaults to 2.
     */
    desiredCapacity?: pulumi.Input<number>;

    /**
     * The minimum number of worker nodes running in the cluster. Defaults to 1.
     */
    minSize?: pulumi.Input<number>;

    /**
     * The maximum number of worker nodes running in the cluster. Defaults to 2.
     */
    maxSize?: pulumi.Input<number>;

    /**
     * The Amazon VPC CNI plugin for this worker pool's cluster.
     */
    vpcCni: VpcCni;

    /**
     * The AMI to use for worker nodes. Defaults to the value of Amazon EKS - Optimized AMI if no value is provided.
	 * More information about the AWS eks optimized ami is available at https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html.
	 * Use the information provided by AWS if you want to build your own AMI.
     */
    amiId?: pulumi.Input<string>;
}

/**
 * WorkerPool is a component that wraps the AWS EC2 instances that provide compute capacity for an EKS cluster.
 */
export class WorkerPool extends pulumi.ComponentResource {
    /**
     * The service role used by the EKS cluster.
     */
    public readonly instanceRole: pulumi.Output<aws.iam.Role>;

    /**
     * The security group for the cluster's nodes.
     */
    public readonly nodeSecurityGroup: aws.ec2.SecurityGroup;

    /**
     * Create a new EKS cluster with worker nodes, optional storage classes, and deploy the Kubernetes Dashboard if
     * requested.
     *
     * @param name The _unique_ name of this component.
     * @param args The arguments for this cluster.
     * @param opts A bag of options that control this copmonent's behavior.
     */
    constructor(name: string, args: WorkerPoolOptions, opts?: pulumi.ComponentResourceOptions) {
        super("eks:index:WorkerPool", name, args, opts);

        const k8sProvider = this.getProvider("kubernetes:core:v1/ConfigMap");
        if (k8sProvider === undefined) {
            throw new pulumi.RunError("a 'kubernetes' provider must be specified for a 'WorkerPool'");
        }
        const pool = createWorkerPool(name, args, this, k8sProvider);
        this.instanceRole = pool.instanceRole;
        this.nodeSecurityGroup = pool.nodeSecurityGroup;
        this.registerOutputs(undefined);
    }
}

export interface WorkerPoolData {
    instanceRole: pulumi.Output<aws.iam.Role>;
    nodeSecurityGroup: aws.ec2.SecurityGroup;
    cfnStack: aws.cloudformation.Stack;
}

export function createWorkerPool(name: string, args: WorkerPoolOptions, parent: pulumi.ComponentResource,  k8sProvider: k8s.Provider): WorkerPoolData {
    let instanceRole: pulumi.Output<aws.iam.Role>;
    if (args.instanceRole) {
        instanceRole = pulumi.output(args.instanceRole);
    } else {
        instanceRole = (new ServiceRole(`${name}-instanceRole`, {
            service: "ec2.amazonaws.com",
            managedPolicyArns: [
                "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
                "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
                "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
            ],
        }, { parent: parent })).role;
    }
    // Create the instance role we'll use for worker nodes.
    const instanceRoleARN = instanceRole.apply(r => r.arn);

    let nodeSecurityGroup: aws.ec2.SecurityGroup;
    if (args.nodeSecurityGroup) {
        nodeSecurityGroup = args.nodeSecurityGroup;
    } else {
        nodeSecurityGroup = new aws.ec2.SecurityGroup(`${name}-nodeSecurityGroup`, {
            vpcId: args.vpcId,
            ingress: [
                {
                    description: "Allow nodes to communicate with each other",
                    fromPort: 0,
                    toPort: 0,
                    protocol: "-1", // all
                    self: true,
                },
                {
                    description: "Allow worker Kubelets and pods to receive communication from the cluster control plane",
                    fromPort: 1025,
                    toPort: 65535,
                    protocol: "tcp",
                    securityGroups: [ args.clusterSecurityGroup.id ],
                },
                {
                    description: "Allow pods running extension API servers on port 443 to receive communication from cluster control plane",
                    fromPort: 443,
                    toPort: 443,
                    protocol: "tcp",
                    securityGroups: [ args.clusterSecurityGroup.id ],
                },
            ],
            egress: [{
                description: "Allow internet access.",
                fromPort: 0,
                toPort: 0,
                protocol: "-1",  // all
                cidrBlocks: [ "0.0.0.0/0" ],
            }],
            tags: args.cluster.name.apply(n => <aws.Tags>{
                [`kubernetes.io/cluster/${n}`]: "owned",
            }),
        }, { parent: parent });
    }

    // Enable access to the EKS cluster for worker nodes.
    const instanceRoleMapping: RoleMapping = {
        roleArn: instanceRoleARN,
        username: "system:node:{{EC2PrivateDNSName}}",
        groups: ["system:bootstrappers", "system:nodes"],
    };
    const roleMappings = pulumi.all([pulumi.output(args.roleMappings || []), instanceRoleMapping])
        .apply(([mappings, instanceMapping]) => {
            return jsyaml.safeDump([...mappings, instanceMapping].map(m => ({
                rolearn: m.roleArn,
                username: m.username,
                groups: m.groups,
            })));
        });
    const nodeAccessData: any = {
        mapRoles: roleMappings,
    };
    if (args.userMappings !== undefined) {
        nodeAccessData.mapUsers = pulumi.output(args.userMappings).apply(mappings => {
            return jsyaml.safeDump(mappings.map(m => ({
                userarn: m.userArn,
                username: m.username,
                groups: m.groups,
            })));
        });
    }
    const eksNodeAccess = new k8s.core.v1.ConfigMap(`${name}-nodeAccess`, {
        apiVersion: "v1",
        metadata: {
            name: `aws-auth-${name}`,
            namespace: "kube-system",
        },
        data: nodeAccessData,
    }, { parent: parent, provider: k8sProvider });

    // Create the cluster's worker nodes.
    const instanceProfile = new aws.iam.InstanceProfile(`${name}-instanceProfile`, {
        role: instanceRole,
    }, { parent: parent });

    const eksClusterIngressRule = new aws.ec2.SecurityGroupRule(`${name}-eksClusterIngressRule`, {
        description: "Allow pods to communicate with the cluster API Server",
        type: "ingress",
        fromPort: 443,
        toPort: 443,
        protocol: "tcp",
        securityGroupId: args.clusterSecurityGroup.id,
        sourceSecurityGroupId: nodeSecurityGroup.id,
    }, { parent: parent });
    const nodeSecurityGroupId = pulumi.all([nodeSecurityGroup.id, eksClusterIngressRule.id])
        .apply(([id]) => id);

    // If requested, add a new EC2 KeyPair for SSH access to the instances.
    let keyName: pulumi.Output<string> | undefined;
    if (args.nodePublicKey) {
        const key = new aws.ec2.KeyPair(`${name}-keyPair`, {
            publicKey: args.nodePublicKey,
        }, { parent: parent });
        keyName = key.keyName;
    }

    const cfnStackName = transform(`${name}-cfnStackName`, name, n => `${n}-${crypto.randomBytes(4).toString("hex")}`, { parent: parent });

    const awsRegion = pulumi.output(aws.getRegion({}, { parent: parent }));
    const userDataArg = args.nodeUserData || pulumi.output("");
    const userdata = pulumi.all([awsRegion, args.cluster.name, args.cluster.endpoint, args.cluster.certificateAuthority, cfnStackName, userDataArg])
        .apply(([region, clusterName, clusterEndpoint, clusterCa, stackName, customUserData]) => {
            if (customUserData !== "") {
                customUserData = `cat >/opt/user-data <<${stackName}-user-data
${customUserData}
${stackName}-user-data
chmod +x /opt/user-data
/opt/user-data
`;
            }

            return `#!/bin/bash

/etc/eks/bootstrap.sh --apiserver-endpoint "${clusterEndpoint}" --b64-cluster-ca "${clusterCa.data}" "${clusterName}"
${customUserData}
/opt/aws/bin/cfn-signal --exit-code $? --stack ${stackName} --resource NodeGroup --region ${region.name}
`;
        });

    let amiId: pulumi.Input<string> = args.amiId!;
    if (args.amiId === undefined) {
        const eksWorkerAmi = aws.getAmi({
            filters: [{
                name: "name",
                values: [ "amazon-eks-node-*" ],
            }],
            mostRecent: true,
            owners: [ "602401143452" ], // Amazon
        }, { parent: parent });
        amiId = eksWorkerAmi.then(r => r.imageId);
    }

    const nodeLaunchConfiguration = new aws.ec2.LaunchConfiguration(`${name}-nodeLaunchConfiguration`, {
        associatePublicIpAddress: true,
        imageId: amiId,
        instanceType: args.instanceType || "t2.medium",
        iamInstanceProfile: instanceProfile.id,
        keyName: keyName,
        securityGroups: [ nodeSecurityGroupId ],
        rootBlockDevice: {
            volumeSize: args.nodeRootVolumeSize || 20, // GiB
            volumeType: "gp2", // default is "standard"
            deleteOnTermination: true,
        },
        userData: userdata,
    }, { parent: parent });

    const workerSubnetIds = args.nodeSubnetIds ? pulumi.output(args.nodeSubnetIds) : pulumi.output(args.clusterSubnetIds).apply(ids => computeWorkerSubnets(this, ids));
    const cfnTemplateBody = pulumi.all([
        nodeLaunchConfiguration.id,
        args.desiredCapacity || 2,
        args.minSize || 1,
        args.maxSize || 2,
        args.cluster.name,
        workerSubnetIds.apply(JSON.stringify),
    ]).apply(([launchConfig, desiredCapacity, minSize, maxSize, clusterName, vpcSubnetIds]) => `
            AWSTemplateFormatVersion: '2010-09-09'
            Resources:
                NodeGroup:
                    Type: AWS::AutoScaling::AutoScalingGroup
                    Properties:
                      DesiredCapacity: ${desiredCapacity}
                      LaunchConfigurationName: ${launchConfig}
                      MinSize: ${minSize}
                      MaxSize: ${maxSize}
                      VPCZoneIdentifier: ${vpcSubnetIds}
                      Tags:
                      - Key: Name
                        Value: ${clusterName}-worker
                        PropagateAtLaunch: 'true'
                      - Key: kubernetes.io/cluster/${clusterName}
                        Value: 'owned'
                        PropagateAtLaunch: 'true'
                    UpdatePolicy:
                      AutoScalingRollingUpdate:
                        MinInstancesInService: '1'
                        MaxBatchSize: '1'
            `);

    const cfnStack = new aws.cloudformation.Stack(`${name}-nodes`, {
        name: cfnStackName,
        templateBody: cfnTemplateBody,
    }, { parent: parent, dependsOn: [eksNodeAccess, args.vpcCni] });

    return {
        instanceRole: instanceRole,
        nodeSecurityGroup: nodeSecurityGroup,
        cfnStack: cfnStack,
    };
}

// computeWorkerSubnets attempts to determine the subset of the given subnets to use for worker nodes.
//
// As per https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html, an EKS cluster that is attached to public
// and private subnets will only expose its API service to workers on the private subnets. Any workers attached to the
// public subnets will be unable to communicate with the API server.
//
// If all of the given subnet IDs are public, the list of subnet IDs is returned as-is. If any private subnet is given,
// only the IDs of the private subnets are returned. A subnet is deemed private iff it has no route in its route table
// that routes directly to an internet gateway. If any such route exists in a subnet's route table, it is treated as
// public.
async function computeWorkerSubnets(parent: pulumi.Resource, subnetIds: string[]): Promise<string[]> {
    const publicSubnets: string[] = [];

    const privateSubnets: string[] = [];
    for (const subnetId of subnetIds) {
        // Fetch the route table for this subnet.
        const routeTable = await (async () => {
            try  {
                // Attempt to get the explicit route table for this subnet. If there is no explicit rouute table for
                // this subnet, this call will throw.
                return await aws.ec2.getRouteTable({ subnetId: subnetId }, { parent: parent });
            } catch {
                // If we reach this point, the subnet may not have an explicitly associated route table. In this case
                // the subnet is associated with its VPC's main route table (see
                // https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html#RouteTables for details).
                const subnet = await aws.ec2.getSubnet({ id: subnetId }, { parent: parent });
                const mainRouteTableInfo = await aws.ec2.getRouteTables({
                    vpcId: subnet.vpcId,
                    filters: [{
                        name: "association.main",
                        values: [ "true" ],
                    }],
                }, { parent: parent });
                return await aws.ec2.getRouteTable({ routeTableId: mainRouteTableInfo.ids[0] }, { parent: parent });
            }
        })();

            // Once we have the route table, check its list of routes for a route to an internet gateway.
        const hasInternetGatewayRoute = routeTable.routes.find(r => !!r.gatewayId) !== undefined;
        if (hasInternetGatewayRoute) {
            publicSubnets.push(subnetId);
        } else {
            privateSubnets.push(subnetId);
        }
    }
    return privateSubnets.length === 0 ? publicSubnets : privateSubnets;
}
