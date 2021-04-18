import { set } from 'lodash';
import * as AWS from 'aws-sdk';

interface IResponse {
  headers?: any;
  body?: string;
  statusCode?: number;
}

export const response = async (data, code) => {
  const responseObj: IResponse = {};

  // Set for cors
  set(responseObj, ['headers', 'Access-Control-Allow-Origin'], '*');

  responseObj.statusCode = code;
  responseObj.body = JSON.stringify(data);

  return Promise.resolve(responseObj);
};

export const putItem = async (tableName, item, conditionExpression = null) => {
  AWS.config.update({
    region: 'ap-southeast-2',
    correctClockSkew: true,
  });

  const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true,
  });
  const params: any = {
    TableName: tableName,
    Item: item,
  };

  if (conditionExpression) {
    params.ConditionExpression = conditionExpression;
  }

  return docClient.put(params).promise();
};

export const scan = async (tableName) => {
  AWS.config.update({
    region: 'ap-southeast-2',
    correctClockSkew: true,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();
  const parameters = {
    TableName: tableName,
    ConsistentRead: true,
  };

  const fullList: { Items: any[] } = {
    Items: [],
  };
  const doScan = (params) =>
    docClient
      .scan(params)
      .promise()
      .then((data) => {
        if (data.Items) {
          fullList.Items = fullList.Items.concat(data.Items);
        }
        if (data.LastEvaluatedKey) {
          return doScan(
            Object.assign({}, params, {
              ExclusiveStartKey: data.LastEvaluatedKey,
            }),
          );
        }

        return fullList;
      })
      .catch(() => {
        return fullList;
      });

  return doScan(parameters);
};

export const getItemByKey = async (tableName, key) => {
  AWS.config.update({
    region: 'ap-southeast-2',
    correctClockSkew: true,
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: tableName,
    ConsistentRead: true,
    Key: key,
  };
  return docClient.get(params).promise();
};
