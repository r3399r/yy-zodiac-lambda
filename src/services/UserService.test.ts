import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { FAKE_CREATIONID, Role, UserCommon } from 'src/model/sadalsuud/User';
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
  let fakeUser: DbUser;

  beforeAll(() => {
    dummyUser = {
      lineUserId: 'test',
      role: Role.STAR_RAIN,
      joinSession: 40,
      phone: 'phone',
      trips: [],
    };
    dummyDbUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: 'test',
      ...dummyUser,
    };
    fakeUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: FAKE_CREATIONID,
      lineUserId: 'abc',
      role: Role.UNKNOWN,
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

    const res: DbUser | null = await userService.getUser(
      SadalsuudEntity.user,
      'abc'
    );
    expect(res).toStrictEqual(dummyDbUser);
  });

  it('getUser should return unknonw user in Sadalsuud project', async () => {
    mockDbService.query = jest.fn(() => []);

    const res: DbUser | null = await userService.getUser(
      SadalsuudEntity.user,
      'abc'
    );
    expect(res).toStrictEqual(fakeUser);
  });

  it('getUser should return null', async () => {
    mockDbService.query = jest.fn(() => []);

    const res: DbUser | null = await userService.getUser(
      SadalsuudEntity.trip,
      'abc'
    );
    expect(res).toBeNull();
  });

  it('getUser should fail with abnormal result', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser, dummyDbUser]);

    await expect(
      userService.getUser(SadalsuudEntity.user, 'abc')
    ).rejects.toThrow('Get multiple users with same lineUserId');
  });

  it('addEmptyUser should work', async () => {
    const input: UserCommon = { lineUserId: 'testLineId' };
    await userService.addEmptySadalsuudUser(input);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('addUser should work', async () => {
    await userService.addUser(SadalsuudEntity.user, dummyUser);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
