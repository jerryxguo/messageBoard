import { register } from './userController';
import { putItem } from '../utility';
import { dynamoDBTables } from '../constants';

jest.mock('../utility.ts', () => {
  const mock = {
    ...jest.requireActual('../utility.ts'),
    putItem: jest.fn().mockResolvedValue({}),
  };
  return mock;
});

const uuid = '25826408-386d-4a9a-9692-6872b599b400';
jest.mock('uuid', () => {
  const mock = {
    ...jest.requireActual('uuid'),
    v4: jest.fn().mockImplementation(() => {
      return uuid;
    }),
  };
  return mock;
});

describe('user register tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // most important - it clears the cache
  });

  it('should return err when payload is null ', async () => {
    const event = {};
    const result = await register(event);
    expect(result.statusCode).toEqual(401);
    expect(putItem).toHaveBeenCalledTimes(0);
  });

  it('should return err when fist name is not in payload ', async () => {
    const event = {
      body: JSON.stringify({
        lastName: 'last',
        eamil: 'email',
      }),
    };
    const result = await register(event);
    expect(result.statusCode).toEqual(401);
    expect(putItem).toHaveBeenCalledTimes(0);
  });

  it('should return err when last name is not in payload ', async () => {
    const event = {
      payload: JSON.stringify({
        firstName: 'first',
        eamil: 'email',
      }),
    };
    const result = await register(event);
    expect(result.statusCode).toEqual(401);
    expect(putItem).toHaveBeenCalledTimes(0);
  });
  it('should return err when email is not in payload ', async () => {
    const event = {
      body: JSON.stringify({
        firstName: 'first',
        lastName: 'last',
      }),
    };
    const result = await register(event);
    expect(result.statusCode).toEqual(401);
    expect(putItem).toHaveBeenCalledTimes(0);
  });

  it('should call dynamodb to create a user item ', async () => {
    const event = {
      body: JSON.stringify({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
      }),
    };
    const result = await register(event);
    expect(result.statusCode).toEqual(200);
    expect(putItem).toHaveBeenCalledTimes(1);
    expect(putItem).toHaveBeenCalledWith(dynamoDBTables.userTable, {
      firstName: 'first',
      lastName: 'last',
      email: 'email',
      id: uuid,
    });
  });
});
