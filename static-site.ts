#!/usr/bin/env node
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import { CfnOutput, Stack, RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution.
 */
export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "RS-SITE-AWS-OAI"
    );

    // Content bucket
    const staticSiteBucket = new s3.Bucket(this, "RSSiteAWSBucket", {
      bucketName: "rs-site-aws-bucket",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    new CfnOutput(this, "Bucket", { value: staticSiteBucket.bucketName });

    // These 2 approaches are equivalent
    // staticSiteBucket.grantRead(cloudFrontOAI);
    staticSiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [staticSiteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      "RSSiteAWSDistribution",
      {
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
        defaultBehavior: {
          origin: new cloudfront_origins.S3Origin(staticSiteBucket, {
            originAccessIdentity: cloudFrontOAI,
          }),
          compress: true,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      }
    );

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: staticSiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, "Domain URL", {
      value: distribution.distributionDomainName,
    });
  }
}
