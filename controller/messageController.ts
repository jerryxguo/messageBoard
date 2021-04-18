import * as _ from 'lodash';
import moment from 'moment';
import { response, putItem } from '../utility';
import { dynamoDBTables } from '../constants';

export const postMessage = async (event) => {
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
    const { userId, boardId, message } = bodyDataJson;
    if (!userId) {
      return response(
        {
          success: false,
          error: Error('invalid payload'),
        },
        401,
      );
    }
    // post a message to a board
    const messageObj = { userId, boardId, message, timestamp: moment().toISOString() };
    await putItem(dynamoDBTables.messageTable, messageObj);
    return response({ success: true, data: messageObj }, 200);
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

export const getMessage = async (event) => {
  try {
    const requestPathParams = _.get(event, 'pathParameters', {});
    const queryStringParameters = _.get(event, 'queryStringParameters', {});
    const { startDate, endDate } = queryStringParameters;
    const { userId, boardId } = requestPathParams;
    if (startDate && endDate) {
      // get messages posted beteween certain timestamps
      // todo: query db by conditions with index local_message_timestamp
      return response(
        {
          success: false,
          error: Error('invalid payload'),
        },
        403,
      );
    }
    if (userId) {
      // get boards a user has posted to
      // todo: query db by userId with index local_message_board
      return response(
        {
          success: false,
          error: Error('invalid payload'),
        },
        403,
      );
    }
    if (boardId) {
      // get messages from a board
      // todo: query db by boardId
      return response(
        {
          success: false,
          error: Error('invalid payload'),
        },
        403,
      );
    }
    // todo:
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
