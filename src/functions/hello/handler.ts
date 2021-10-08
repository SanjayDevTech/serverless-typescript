import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

const hello: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log(event.httpMethod);
  return formatJSONResponse({
    message: `Hello ${event.queryStringParameters?.name}, welcome to the exciting Serverless world!`,
  });
};

export const main = middyfy(hello);
