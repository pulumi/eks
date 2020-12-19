# coding=utf-8
# *** WARNING: this file was generated by pulumi-gen-eks. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

SNAKE_TO_CAMEL_CASE_TABLE = {
    "allow_volume_expansion": "allowVolumeExpansion",
    "ami_id": "amiId",
    "ami_type": "amiType",
    "api_version": "apiVersion",
    "auto_scaling_group_name": "autoScalingGroupName",
    "auto_scaling_group_tags": "autoScalingGroupTags",
    "aws_provider": "awsProvider",
    "binary_data": "binaryData",
    "bootstrap_extra_args": "bootstrapExtraArgs",
    "cfn_stack": "cfnStack",
    "cloud_formation_tags": "cloudFormationTags",
    "cluster_ingress_rule": "clusterIngressRule",
    "cluster_name": "clusterName",
    "cluster_security_group": "clusterSecurityGroup",
    "cluster_security_group_tags": "clusterSecurityGroupTags",
    "cluster_tags": "clusterTags",
    "create_oidc_provider": "createOidcProvider",
    "creation_role_provider": "creationRoleProvider",
    "creation_timestamp": "creationTimestamp",
    "custom_network_config": "customNetworkConfig",
    "default_node_group": "defaultNodeGroup",
    "deletion_grace_period_seconds": "deletionGracePeriodSeconds",
    "deletion_timestamp": "deletionTimestamp",
    "desired_capacity": "desiredCapacity",
    "disable_vpc_cni": "disableVpcCni",
    "disk_size": "diskSize",
    "eks_cluster": "eksCluster",
    "eks_cluster_ingress_rule": "eksClusterIngressRule",
    "eks_node_access": "eksNodeAccess",
    "enabled_cluster_log_types": "enabledClusterLogTypes",
    "encrypt_root_block_device": "encryptRootBlockDevice",
    "encryption_config_key_arn": "encryptionConfigKeyArn",
    "endpoint_private_access": "endpointPrivateAccess",
    "endpoint_public_access": "endpointPublicAccess",
    "eni_config_label_def": "eniConfigLabelDef",
    "eni_mtu": "eniMtu",
    "external_snat": "externalSnat",
    "extra_node_security_groups": "extraNodeSecurityGroups",
    "fargate_profile": "fargateProfile",
    "force_update_version": "forceUpdateVersion",
    "generate_name": "generateName",
    "instance_profile": "instanceProfile",
    "instance_profile_name": "instanceProfileName",
    "instance_role": "instanceRole",
    "instance_roles": "instanceRoles",
    "instance_type": "instanceType",
    "instance_types": "instanceTypes",
    "iops_per_gb": "iopsPerGb",
    "key_name": "keyName",
    "kms_key_id": "kmsKeyId",
    "kubelet_extra_args": "kubeletExtraArgs",
    "log_file": "logFile",
    "log_level": "logLevel",
    "managed_fields": "managedFields",
    "max_size": "maxSize",
    "min_size": "minSize",
    "mount_options": "mountOptions",
    "node_ami_id": "nodeAmiId",
    "node_associate_public_ip_address": "nodeAssociatePublicIpAddress",
    "node_group": "nodeGroup",
    "node_group_name": "nodeGroupName",
    "node_group_options": "nodeGroupOptions",
    "node_port_support": "nodePortSupport",
    "node_public_key": "nodePublicKey",
    "node_role": "nodeRole",
    "node_role_arn": "nodeRoleArn",
    "node_root_volume_size": "nodeRootVolumeSize",
    "node_security_group": "nodeSecurityGroup",
    "node_security_group_tags": "nodeSecurityGroupTags",
    "node_subnet_ids": "nodeSubnetIds",
    "node_user_data": "nodeUserData",
    "node_user_data_override": "nodeUserDataOverride",
    "oidc_provider": "oidcProvider",
    "owner_references": "ownerReferences",
    "pod_execution_role_arn": "podExecutionRoleArn",
    "private_subnet_ids": "privateSubnetIds",
    "profile_name": "profileName",
    "provider_credential_opts": "providerCredentialOpts",
    "public_access_cidrs": "publicAccessCidrs",
    "public_subnet_ids": "publicSubnetIds",
    "reclaim_policy": "reclaimPolicy",
    "release_version": "releaseVersion",
    "resource_version": "resourceVersion",
    "role_arn": "roleArn",
    "role_mappings": "roleMappings",
    "security_group": "securityGroup",
    "security_group_rule": "securityGroupRule",
    "self_link": "selfLink",
    "service_role": "serviceRole",
    "skip_default_node_group": "skipDefaultNodeGroup",
    "spot_price": "spotPrice",
    "storage_classes": "storageClasses",
    "subnet_ids": "subnetIds",
    "user_arn": "userArn",
    "user_mappings": "userMappings",
    "veth_prefix": "vethPrefix",
    "volume_binding_mode": "volumeBindingMode",
    "vpc_cni": "vpcCni",
    "vpc_cni_options": "vpcCniOptions",
    "vpc_id": "vpcId",
    "warm_eni_target": "warmEniTarget",
    "warm_ip_target": "warmIpTarget",
}

CAMEL_TO_SNAKE_CASE_TABLE = {
    "allowVolumeExpansion": "allow_volume_expansion",
    "amiId": "ami_id",
    "amiType": "ami_type",
    "apiVersion": "api_version",
    "autoScalingGroupName": "auto_scaling_group_name",
    "autoScalingGroupTags": "auto_scaling_group_tags",
    "awsProvider": "aws_provider",
    "binaryData": "binary_data",
    "bootstrapExtraArgs": "bootstrap_extra_args",
    "cfnStack": "cfn_stack",
    "cloudFormationTags": "cloud_formation_tags",
    "clusterIngressRule": "cluster_ingress_rule",
    "clusterName": "cluster_name",
    "clusterSecurityGroup": "cluster_security_group",
    "clusterSecurityGroupTags": "cluster_security_group_tags",
    "clusterTags": "cluster_tags",
    "createOidcProvider": "create_oidc_provider",
    "creationRoleProvider": "creation_role_provider",
    "creationTimestamp": "creation_timestamp",
    "customNetworkConfig": "custom_network_config",
    "defaultNodeGroup": "default_node_group",
    "deletionGracePeriodSeconds": "deletion_grace_period_seconds",
    "deletionTimestamp": "deletion_timestamp",
    "desiredCapacity": "desired_capacity",
    "disableVpcCni": "disable_vpc_cni",
    "diskSize": "disk_size",
    "eksCluster": "eks_cluster",
    "eksClusterIngressRule": "eks_cluster_ingress_rule",
    "eksNodeAccess": "eks_node_access",
    "enabledClusterLogTypes": "enabled_cluster_log_types",
    "encryptRootBlockDevice": "encrypt_root_block_device",
    "encryptionConfigKeyArn": "encryption_config_key_arn",
    "endpointPrivateAccess": "endpoint_private_access",
    "endpointPublicAccess": "endpoint_public_access",
    "eniConfigLabelDef": "eni_config_label_def",
    "eniMtu": "eni_mtu",
    "externalSnat": "external_snat",
    "extraNodeSecurityGroups": "extra_node_security_groups",
    "fargateProfile": "fargate_profile",
    "forceUpdateVersion": "force_update_version",
    "generateName": "generate_name",
    "instanceProfile": "instance_profile",
    "instanceProfileName": "instance_profile_name",
    "instanceRole": "instance_role",
    "instanceRoles": "instance_roles",
    "instanceType": "instance_type",
    "instanceTypes": "instance_types",
    "iopsPerGb": "iops_per_gb",
    "keyName": "key_name",
    "kmsKeyId": "kms_key_id",
    "kubeletExtraArgs": "kubelet_extra_args",
    "logFile": "log_file",
    "logLevel": "log_level",
    "managedFields": "managed_fields",
    "maxSize": "max_size",
    "minSize": "min_size",
    "mountOptions": "mount_options",
    "nodeAmiId": "node_ami_id",
    "nodeAssociatePublicIpAddress": "node_associate_public_ip_address",
    "nodeGroup": "node_group",
    "nodeGroupName": "node_group_name",
    "nodeGroupOptions": "node_group_options",
    "nodePortSupport": "node_port_support",
    "nodePublicKey": "node_public_key",
    "nodeRole": "node_role",
    "nodeRoleArn": "node_role_arn",
    "nodeRootVolumeSize": "node_root_volume_size",
    "nodeSecurityGroup": "node_security_group",
    "nodeSecurityGroupTags": "node_security_group_tags",
    "nodeSubnetIds": "node_subnet_ids",
    "nodeUserData": "node_user_data",
    "nodeUserDataOverride": "node_user_data_override",
    "oidcProvider": "oidc_provider",
    "ownerReferences": "owner_references",
    "podExecutionRoleArn": "pod_execution_role_arn",
    "privateSubnetIds": "private_subnet_ids",
    "profileName": "profile_name",
    "providerCredentialOpts": "provider_credential_opts",
    "publicAccessCidrs": "public_access_cidrs",
    "publicSubnetIds": "public_subnet_ids",
    "reclaimPolicy": "reclaim_policy",
    "releaseVersion": "release_version",
    "resourceVersion": "resource_version",
    "roleArn": "role_arn",
    "roleMappings": "role_mappings",
    "securityGroup": "security_group",
    "securityGroupRule": "security_group_rule",
    "selfLink": "self_link",
    "serviceRole": "service_role",
    "skipDefaultNodeGroup": "skip_default_node_group",
    "spotPrice": "spot_price",
    "storageClasses": "storage_classes",
    "subnetIds": "subnet_ids",
    "userArn": "user_arn",
    "userMappings": "user_mappings",
    "vethPrefix": "veth_prefix",
    "volumeBindingMode": "volume_binding_mode",
    "vpcCni": "vpc_cni",
    "vpcCniOptions": "vpc_cni_options",
    "vpcId": "vpc_id",
    "warmEniTarget": "warm_eni_target",
    "warmIpTarget": "warm_ip_target",
}
