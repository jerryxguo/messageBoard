import { v4 as uuidv4 } from 'uuid';
import { response, putItem, scan } from '../utility';
import { dynamoDBTables } from '../constants';

export const register = async (event) => {
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
    const { firstName, lastName, email } = bodyDataJson;
    if (!firstName || !lastName || !email) {
      return response(
        {
          success: false,
          error: Error('invalid payload'),
        },
        401,
      );
    }
    // register user
    const user = { id: uuidv4(), firstName, lastName, email };
    await putItem(dynamoDBTables.userTable, user);
    return response({ success: true, data: user }, 200);
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

export const listUser = async () => {
  try {
    // list users
    const data = await scan(dynamoDBTables.userTable);
    return response({ users: data }, 200);
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
