// *** WARNING: this file was generated by pulumi-gen-eks. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.Eks.Inputs
{

    /// <summary>
    /// Contains the AWS Role and Provider necessary to override the `[system:master]` entity ARN. This is an optional argument used when creating `Cluster`. Read more: https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html
    /// </summary>
    public sealed class CreationRoleProviderArgs : Pulumi.ResourceArgs
    {
        [Input("provider", required: true)]
        public Input<Pulumi.Aws.Provider> Provider { get; set; } = null!;

        [Input("role", required: true)]
        public Input<Pulumi.Aws.Iam.Role> Role { get; set; } = null!;

        public CreationRoleProviderArgs()
        {
        }
    }
}