import { bindings } from 'src/bindings';
import { LineEntity } from 'src/model/DbKey';
import { DbUser, Role, User, UserCommon } from 'src/model/User';
import { DbService } from './DbService';
import { UserService } from './UserService';

/**
 * Tests of the UserService class.
 */
describe('UserService', () => {
  let userService: UserService;
  let mockDbService: any;
  let dummyUser: User;
  let dummyDbUser: DbUser;

  beforeAll(() => {
    dummyUser = {
      lineUserId: 'test',
      role: Role.STAR_RAIN,
      joinSession: 40,
      phone: 'phone',
      trips: [],
    };
    dummyDbUser = {
      projectEntity: LineEntity.user,
      creationId: 'test',
      ...dummyUser,
    };
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.putItem = jest.fn();

    userService = bindings.get<UserService>(UserService);
  });

  it('getUser should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser]);

    const res: DbUser | null = await userService.getUser('abc');
    expect(res).toStrictEqual(dummyDbUser);
  });

  it('getUser should return null', async () => {
    mockDbService.query = jest.fn(() => []);

    const res: DbUser | null = await userService.getUser('abc');
    expect(res).toBeNull();
  });

  it('getUser should fail with abnormal result', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser, dummyDbUser]);

    await expect(userService.getUser('abc')).rejects.toThrow(
      'Get multiple users with same lineUserId'
    );
  });

  it('addEmptyUser should work', async () => {
    const input: UserCommon = { lineUserId: 'testLineId' };
    await userService.addEmptyUser(input);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('addUser should work', async () => {
    await userService.addUser(dummyUser);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
