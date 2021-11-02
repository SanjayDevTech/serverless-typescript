import AWS from "aws-sdk";
import {
  QueryParamsT,
  ScanParamsT,
  PutRequestT,
  UpdateParamsT,
  DeleteParamsT,
} from "./types";

export enum Tables {}

const dynamodbClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "latest",
  region: "ap-south-1",
});

export const query = async (params: QueryParamsT) => {
  try {
    return await dynamodbClient.query(params).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};

export const scan = async (params: ScanParamsT) => {
  try {
    return await dynamodbClient.scan(params).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};

export const put = async (putRequest: PutRequestT) => {
  try {
    return await dynamodbClient.put(putRequest).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};

export const update = async (params: UpdateParamsT) => {
  try {
    return await dynamodbClient.update(params).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};

export const deleteItem = async (params: DeleteParamsT) => {
  try {
    return await dynamodbClient.delete(params).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};

export const batchWrite = async (putRequest: any) => {
  try {
    return await dynamodbClient.batchWrite(putRequest).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};

export const batchGet = async (params: any) => {
  try {
    return await dynamodbClient.batchGet(params).promise();
  } catch (e) {
    console.log("error ", e);
    return null;
  }
};
