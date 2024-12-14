import { createAPIGatewayProxyEvent } from "./event-builder.js";

export const event = createAPIGatewayProxyEvent({
  body: "Hi there!",
});
