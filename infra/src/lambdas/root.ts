import { APIGatewayProxyEvent } from "aws-lambda";
import type { RootInput, RootOutput } from "../types";
import { createLambdaHandler } from "@surfacedstudio/core/server/lambda";
import type { LambdaHandlerFunctionArgs, ProxyApiResponse } from "@surfacedstudio/core/server/lambda";
import { ApiCustomError } from "@surfacedstudio/core/server/api-errors";
import { logger } from "../logger";
import { corsHeaders } from "../constants/headers";

export const handler = createLambdaHandler<RootInput, RootOutput>(
  async ({ event, data }: LambdaHandlerFunctionArgs<RootInput>): Promise<ProxyApiResponse<RootOutput>> => {
    return {
      statusCode: 200,
      body: {
        message: `Midi2Macro API ${process.env.ENVIRONMENT}`,
        received: event,
        input: data,
      },
      headers: {},
    };
  },
  logger,
  corsHeaders
);
