import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { Role } from 'src/model/sadalsuud/User';
import { DbUser, User } from 'src/model/User';
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
      name: 'testName',
      status: 'testStatus',
    };
    dummyDbUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: 'test',
      ...dummyUser,
    };
  });

  beforeEach(() => {
    mockDbService = { putItem: jest.fn(), getItem: jest.fn(() => dummyDbUser) };
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    userService = bindings.get<UserService>(UserService);
  });

  it('getUserById should work', async () => {
    const res: DbUser | null = await userService.getUserById(
      SadalsuudEntity.user,
      'abc'
    );
    expect(res).toStrictEqual(dummyDbUser);
  });

  it('getUserByLineId should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser]);

    const res: DbUser | null = await userService.getUserByLineId(
      SadalsuudEntity.user,
      'abc'
    );
    expect(res).toStrictEqual(dummyDbUser);
  });

  it('getUserByLineId should return null', async () => {
    mockDbService.query = jest.fn(() => []);

    const res: DbUser | null = await userService.getUserByLineId(
      SadalsuudEntity.trip,
      'abc'
    );
    expect(res).toBeNull();
  });

  it('getUserByLineId should fail with abnormal result', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser, dummyDbUser]);

    await expect(
      userService.getUserByLineId(SadalsuudEntity.user, 'abc')
    ).rejects.toThrow('Get multiple users with same lineUserId');
  });

  it('addUser should work', async () => {
    await userService.addUser(SadalsuudEntity.user, dummyUser);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
