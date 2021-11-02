export interface QueryParamsT {
  TableName: string;
  IndexName?: string;
  KeyConditionExpression: string;
  FilterExpression?: string;
  ExpressionAttributeValues: object;
  ProjectionExpression?: string;
  Limit?: number;
  ScanIndexForward?: boolean;
}

export interface ScanParamsT {
  TableName: string;
  FilterExpression?: string;
  ExpressionAttributeValues?: object;
  ProjectionExpression?: string;
  Limit?: number;
  ScanIndexForward?: boolean;
}

export interface PutRequestT {
  Item: object;
  TableName: string;
}

export interface UpdateParamsT {
  TableName: string;
  Key: object;
  ConditionExpression?: string;
  UpdateExpression: string;
  ExpressionAttributeValues?: object;
}

export interface DeleteParamsT {
  TableName: string;
  Key: object;
  ConditionExpression?: string;
  ExpressionAttributeValues?: object;
}

export interface BatchGetItemParamsT {}
