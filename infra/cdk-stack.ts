import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi, EndpointType } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
// import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  App,
  Stack,
  RemovalPolicy,
  aws_route53 as route53,
  aws_certificatemanager as certificatemanager,
  aws_route53_targets as route53_targets,
  // aws_events as events,
  // aws_events_targets as events_targets,
} from "aws-cdk-lib";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { corsHeaders } from "./src/constants/headers";

interface StackProps extends cdk.StackProps {
  serviceName: string;
  environment: "prod" | "dev";
  account: string;
  region: string;
  // www.midi2macro.com and api{-dev}.midi2macro.com will be added to R53 records
  domainName: string;
  // wildcard SSL cert for domain
  // Cloudfront needs us-east-1
  // Api Gateway needs to use ap-southeast-2
  usEast1CertificateArn: string;
  apSoutheast2CertificateArn: string;
}

export class Midi2MacroStack extends Stack {
  constructor(app: App, id: string, props: StackProps) {
    super(app, id, {
      ...props,
      stackName: `${props.serviceName}-infra-${props.environment}`,
      env: { account: props.account, region: props.region },
    });

    const isProd = props.environment === "prod";
    const apiSubdomain = isProd ? "api" : "api-dev";
    const websiteSubdomain = isProd ? "www" : "dev";

    // Set a default parameter name
    // @ts-ignore
    const parameterName = new cdk.CfnParameter(this, "parameterName", {
      type: "String",
      default: "default-value",
    });

    const bucket = new s3.Bucket(this, "Midi2MacroWebsiteBucket", {
      bucketName: `www.${props.domainName}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });

    const redirectFunction = new cloudfront.Function(this, "Function", {
      code: cloudfront.FunctionCode.fromFile({ filePath: path.join(__dirname, "src/functions/redirect-to-www.js") }),
      // Note that JS_2_0 must be used for Key Value Store support
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      // keyValueStore: store,
    });

    const usEast1Certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      `${props.serviceName}-us-east-1-certificate`,
      props.usEast1CertificateArn
    );

    const apSoutheast2Certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      `${props.serviceName}-ap-southeast-2-certificate`,
      props.apSoutheast2CertificateArn
    );

    const distribution = new cloudfront.Distribution(this, "Midi2MacroWebsiteDistribution", {
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        compress: true,
        origin:
          // OAI allows S3 bucket to be private and not enabled for website hosting
          cloudfrontOrigins.S3BucketOrigin.withOriginAccessIdentity(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // Redirect root domain to www in prod
        functionAssociations: isProd
          ? [
              {
                function: redirectFunction,
                eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
              },
            ]
          : undefined,
      },
      defaultRootObject: "index.html",
      domainNames: [`${websiteSubdomain}.${props.domainName}`, `${props.domainName}`],
      certificate: usEast1Certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          // Serve that react root page
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(30),
        },
      ],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
    });

    const zone = route53.HostedZone.fromLookup(this, "baseZone", {
      domainName: props.domainName,
    });

    new route53.ARecord(this, "web-subdomain-DNS", {
      zone: zone,
      recordName: websiteSubdomain,
      target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
    });

    // In prod we redirect root domain to www so also need to point DNS at Cloudfront
    if (isProd) {
      new route53.ARecord(this, "web-subdomain-redirect-DNS", {
        zone: zone,
        recordName: undefined,
        target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
      });
    }

    // new s3Deploy.BucketDeployment(this, "TecoWebsiteBucketDeployment", {
    //   sources: [s3Deploy.Source.asset(path.join(__dirname, "../website/dist"))],
    //   destinationBucket: bucket,
    // });

    const dynamoTable = new Table(this, `${props.serviceName}-items`, {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING,
      },
      tableName: `${props.serviceName}-items`,

      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          "@aws-sdk/client-dynamodb",
          "@aws-sdk/lib-dynamodb",
        ],
      },
      depsLockFilePath: join(__dirname, "yarn.lock"),
      environment: {
        PRIMARY_KEY: "itemId",
        TABLE_NAME: dynamoTable.tableName,
        ENVIRONMENT: props.environment,
      },
      runtime: Runtime.NODEJS_20_X,
    };

    // Create a Lambda function for each of the CRUD operations
    const rootLambda = new NodejsFunction(this, "rootFunction", {
      entry: join(__dirname, "src", "lambdas", "root.ts"),
      ...nodeJsFunctionProps,
    });
    const getOneLambda = new NodejsFunction(this, "getOneItemFunction", {
      entry: join(__dirname, "src", "lambdas", "get-one.ts"),
      ...nodeJsFunctionProps,
    });
    const getAllLambda = new NodejsFunction(this, "getAllItemsFunction", {
      entry: join(__dirname, "src", "lambdas", "get-all.ts"),
      ...nodeJsFunctionProps,
    });
    const createOneLambda = new NodejsFunction(this, "createItemFunction", {
      entry: join(__dirname, "src", "lambdas", "create.ts"),
      ...nodeJsFunctionProps,
    });
    const updateOneLambda = new NodejsFunction(this, "updateItemFunction", {
      entry: join(__dirname, "src", "lambdas", "update-one.ts"),
      ...nodeJsFunctionProps,
    });
    const deleteOneLambda = new NodejsFunction(this, "deleteItemFunction", {
      entry: join(__dirname, "src", "lambdas", "delete-one.ts"),
      ...nodeJsFunctionProps,
    });

    // const eventRule = new events.Rule(this, 'scheduleRule', {
    //   schedule: events.Schedule.cron({ minute: '0', hour: '1' }),
    // });
    // eventRule.addTarget(new events_targets.LambdaFunction(deleteOneLambda))

    // Grant the Lambda function read access to the DynamoDB table
    dynamoTable.grantReadWriteData(getAllLambda);
    dynamoTable.grantReadWriteData(getOneLambda);
    dynamoTable.grantReadWriteData(createOneLambda);
    dynamoTable.grantReadWriteData(updateOneLambda);
    dynamoTable.grantReadWriteData(deleteOneLambda);

    // Integrate the Lambda functions with the API Gateway resource
    const rootIntegration = new LambdaIntegration(rootLambda);
    const getAllIntegration = new LambdaIntegration(getAllLambda);
    const createOneIntegration = new LambdaIntegration(createOneLambda);
    const getOneIntegration = new LambdaIntegration(getOneLambda);
    const updateOneIntegration = new LambdaIntegration(updateOneLambda);
    const deleteOneIntegration = new LambdaIntegration(deleteOneLambda);

    // Create an API Gateway resource for each of the CRUD operations
    const api = new RestApi(this, `${props.serviceName}-api-${props.environment}`, {
      // Adds OPTIONS response to all resources, but each resource still needs to return the same headers in the Lambda handler
      defaultCorsPreflightOptions: {
        allowOrigins: [corsHeaders["Access-Control-Allow-Origin"]],
        allowHeaders: [corsHeaders["Access-Control-Allow-Headers"]],
        allowMethods: [corsHeaders["Access-Control-Allow-Methods"]],
        allowCredentials: false,
      },
      restApiName: `${props.serviceName}-api-${props.environment}`,
      // In case you want to manage binary types, uncomment the following
      // binaryMediaTypes: ["*/*"],
      domainName: {
        domainName: `${apiSubdomain}.${props.domainName}`,
        certificate: apSoutheast2Certificate,
        endpointType: EndpointType.REGIONAL,
      },
    });

    new route53.ARecord(this, "apiDNS", {
      zone: zone,
      recordName: apiSubdomain,
      target: route53.RecordTarget.fromAlias(new route53_targets.ApiGateway(api)),
    });

    api.root.addMethod("GET", rootIntegration);
    // addCorsOptions(api.root);

    const items = api.root.addResource("items");
    items.addMethod("GET", getAllIntegration);
    items.addMethod("POST", createOneIntegration);
    // addCorsOptions(items);

    const singleItem = items.addResource("{id}");
    singleItem.addMethod("GET", getOneIntegration);
    singleItem.addMethod("PATCH", updateOneIntegration);
    singleItem.addMethod("DELETE", deleteOneIntegration);
    // addCorsOptions(singleItem);
  }
}

export function addCorsOptions(apiResource: IResource) {
  return;
  apiResource.addMethod(
    "OPTIONS",
    new MockIntegration({
      // In case you want to use binary media types, uncomment the following line
      // contentHandling: ContentHandling.CONVERT_TO_TEXT,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'http://localhost:3000'",
            "method.response.header.Access-Control-Allow-Credentials": "'false'",
            "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      // In case you want to use binary media types, comment out the following line
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
