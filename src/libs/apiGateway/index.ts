import { verifyToken } from "@libs/cognito";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import type { ApiResponse } from "./types";

export const middyAuth: middy.Middleware<any, any, any> = () => ({
  before: async (handler, next) => {
    handler.event.claim = { isValid: false };
    if (handler.event.headers) {
      const accessToken =
        handler.event.headers["access-token"] ||
        handler.event.headers["Access-Token"];
      if (accessToken) {
        const claim = await verifyToken({
          token: accessToken,
        });
        handler.event.claim = claim;
      }
    }
    next();
  },
});

export const middyLogger: middy.Middleware<any, any, any> = () => ({
  before: async (handler, next) => {
    console.log("Event: ", handler.event);
    next();
  },
});

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(middyLogger());
  // .use(middyAuth());
};

export const success = <T>(data: T = undefined): ApiResponse<T> => ({
  status: true,
  data,
});

export const failed = (error: string): ApiResponse<undefined> => ({
  status: false,
  error,
});

export const _200 = <T>(body: ApiResponse<T>) => ({
  statusCode: 200,
  body: JSON.stringify(body),
});

export const _500 = (error: string = "InternalServerError") => ({
  statusCode: 500,
  body: JSON.stringify(failed(error)),
});

export const _400 = (error: string = "BadRequest") => ({
  statusCode: 400,
  body: JSON.stringify(failed(error)),
});
