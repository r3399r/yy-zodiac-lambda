import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { users } from 'src/lambda/users/users';
import { UsersEvent } from 'src/lambda/users/UsersEvent';
import { UserService } from 'src/services/UserService';
/**
 * Tests of the users function.
 */
describe('users', (): void => {
  let event: UsersEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockUserService: any;

  beforeEach((): void => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockUserService
    mockUserService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    const mockGetUser: jest.Mock = jest.fn((input: number): number => input);

    mockUserService.getUser = mockGetUser;
  });

  it('function should work', async (): Promise<void> => {
    event = {
      httpMethod: 'GET',
      body: null,
      pathParameters: { id: 'abc' },
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify('abc'),
    });
    expect(mockUserService.getUser).toBeCalledTimes(1);
  });
});
