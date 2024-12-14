import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { createLambdaHandler } from "@surfacedstudio/core/server/lambda";
import type {
  LambdaHandlerFunctionArgs,
  ProxyApiResponse,
} from "@surfacedstudio/core/server/lambda";
import { logger } from "../logger";
import { corsHeaders } from "../constants/headers";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = DynamoDBDocument.from(new DynamoDB());

export const handler = createLambdaHandler(
  async ({
    event,
    data,
  }: LambdaHandlerFunctionArgs<any>): Promise<ProxyApiResponse<any>> => {
    const params = {
      TableName: TABLE_NAME,
    };

    try {
      const response = await db.scan(params);
      return { statusCode: 200, body: response.Items };
    } catch (dbError) {
      return { statusCode: 500, body: dbError };
    }
  },
  logger,
  corsHeaders
);
