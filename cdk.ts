#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSite } from "./static-site";

/**
 * Add the following to cdk.json:
 * {
 *   "context": {
 *     "accountId": "1234567890",
 *   }
 * }
 **/
class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, "StaticSite");
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, "MyStaticSite", {
  env: {
    // account: app.node.tryGetContext("accountId"),
    region: "eu-north-1",
  },
});

app.synth();
