import { APIGatewayProxyEvent } from "aws-lambda";

export const createAPIGatewayProxyEvent = ({
  body,
  path,
  headers,
  pathParameters,
  queryStringParameters,
}: {
  body?: any;
  path?: string;
  pathParameters?: { [key: string]: string | undefined };
  headers?: { [key: string]: string | undefined };
  queryStringParameters?: { [key: string]: string | undefined };
}): APIGatewayProxyEvent => ({
  body: body ? JSON.stringify(body) : null,
  headers: headers || {},
  multiValueHeaders: {},
  httpMethod: "",
  isBase64Encoded: false,
  path: path || "",
  pathParameters: pathParameters || {},
  queryStringParameters: queryStringParameters || {},
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: "",
    apiId: "",
    authorizer: undefined,
    protocol: "",
    httpMethod: "",
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "",
      user: null,
      userAgent: null,
      userArn: null,
    },
    path: "",
    stage: "",
    requestId: "",
    requestTimeEpoch: 0,
    resourceId: "",
    resourcePath: "",
  },
  resource: "",
});
