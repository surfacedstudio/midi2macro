import { APIGatewayProxyEvent } from "aws-lambda";

export type MyType = {
  id: number;
};

export type RootInput = null;

export type RootOutput = {
  message: string;
  received: APIGatewayProxyEvent;
  input: any;
};
