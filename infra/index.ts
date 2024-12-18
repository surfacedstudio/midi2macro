#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Midi2MacroStack } from "./cdk-stack";
import { checkBucketExists } from "./s3-helper";

const account = "840751810341";
const region = "ap-southeast-2";
const domainName = "midi2macro.com";

(async () => {
  const app = new cdk.App();

  const environment = app.node.tryGetContext("environment");

  if (environment !== "dev" && environment != "prod") {
    throw new Error(`Invalid environment ${environment}`);
  }

  const isProd = environment === "prod";
  const apiSubdomain = isProd ? "api" : "api-dev";
  const websiteSubdomain = isProd ? "www" : "dev";

  const rootBucketExists = await checkBucketExists(domainName);
  const webBucketExists = await checkBucketExists(`${websiteSubdomain}.${domainName}`);

  // Create the stack
  new Midi2MacroStack(app, `Midi2MacroStack`, {
    environment,
    serviceName: "midi2macro",
    // Required for REST API
    account,
    region,
    isProd,
    domainName,
    websiteSubdomain,
    apiSubdomain,
    rootBucketExists,
    webBucketExists,
    usEast1CertificateArn: "arn:aws:acm:us-east-1:840751810341:certificate/5b1ccc2b-5f5b-4a15-89f4-1e92d92fa05e",
    apSoutheast2CertificateArn: "arn:aws:acm:ap-southeast-2:840751810341:certificate/e839f25e-e529-4f27-b548-fed8bc2b778a",
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  });
})();
