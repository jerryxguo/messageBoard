import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { response, putItem, scan } from '../utility';
import { dynamoDBTables } from '../constants';

export const createBoard = async (event) => {
  try {
    const requestBody = event?.body;
    if (!requestBody) {
      return response(
        {
          success: false,
          error: Error('no payload'),
        },
        401,
      );
    }
    const bodyDataJson = JSON.parse(requestBody) || {};
    const { userId } = bodyDataJson;
    if (!userId) {
      return response(
        {
          success: false,
          error: Error('invalid payload'),
        },
        401,
      );
    }
    // create a new message board
    const board = { userId, id: uuidv4() };
    await putItem(dynamoDBTables.boardTable, board);
    return response({ success: true, data: board }, 200);
  } catch (err) {
    return response(
      {
        success: false,
        error: err,
      },
      500,
    );
  }
};

export const listBoard = async (event) => {
  try {
    const requestPathParams = _.get(event, 'pathParameters', {});
    const { userId } = requestPathParams;
    if (!userId) {
      const data = await scan(dynamoDBTables.boardTable);
      return response({ users: data }, 200);
    }
    // todo: query by userId
    return response(
      {
        success: false,
        error: Error('invalid payload'),
      },
      403,
    );
  } catch (err) {
    return response(
      {
        success: false,
        error: err,
      },
      500,
    );
  }
};
