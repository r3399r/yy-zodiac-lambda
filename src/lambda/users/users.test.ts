import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { users } from 'src/lambda/users/users';
import { UsersEvent } from 'src/lambda/users/UsersEvent';
import { Role, User } from 'src/model/User';
import { UserService } from 'src/services/UserService';
import { successOutput } from 'src/util/LambdaOutput';

/**
 * Tests of the users function.
 */
describe('users', () => {
  let event: UsersEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockUserService: any;
  let user: User;

  beforeAll(() => {
    user = {
      lineUserId: 'testLineUserId',
      role: Role.STAR_RAIN,
      joinSession: 30,
      phone: 'testPhone',
      trips: [],
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockUserService
    mockUserService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockUserService.getUser = jest.fn(() => user);
    mockUserService.addUser = jest.fn();
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      pathParameters: { id: 'abc' },
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(user)
    );
    expect(mockUserService.getUser).toBeCalledTimes(1);
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(user),
      pathParameters: null,
    };
    await users(event, lambdaContext);
    expect(mockUserService.addUser).toBeCalledTimes(1);
  });
});
