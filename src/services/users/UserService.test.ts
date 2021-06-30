import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbStar } from 'src/model/sadalsuud/Star';
import { DbStarPair } from 'src/model/sadalsuud/StarPair';
import { Role } from 'src/model/sadalsuud/User';
import { DbUser, User } from 'src/model/User';
import { DbService } from 'src/services/DbService';
import { StarService } from 'src/services/StarService';
import { Validator } from 'src/Validator';
import { UserService } from './UserService';

/**
 * Tests of the UserService class.
 */
describe('UserService', () => {
  let userService: UserService;
  let mockDbService: any;
  let mockStarService: any;
  let mockValidator: any;
  let dummyStarUser: User;
  let dummyDbStarUser: DbUser;
  let dummyStarRainUser: User;
  let dummyDbStarRainUser: DbUser;
  let dummyStarPair: DbStarPair;
  let dummyStar: DbStar;

  beforeAll(() => {
    dummyStarUser = {
      lineUserId: 'test',
      role: Role.STAR,
      phone: 'phone',
      name: 'testName',
      status: 'testStatus',
    };
    dummyDbStarUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: 'test',
      ...dummyStarUser,
    };
    dummyStarRainUser = {
      lineUserId: 'test',
      role: Role.STAR_RAIN,
      joinSession: 100,
      phone: 'phone',
      name: 'testName',
      status: 'testStatus',
    };
    dummyDbStarRainUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: 'testSR',
      ...dummyStarRainUser,
    };
    dummyStarPair = {
      projectEntity: SadalsuudEntity.starPair,
      creationId: 'testSP',
      starId: 'testStarId',
      userId: 'testUserId',
      relationship: 'testRelationShip',
    };
    dummyStar = {
      projectEntity: SadalsuudEntity.star,
      creationId: 'testStar',
      name: 'testName',
      birthday: 'testBirthday',
      hasBook: true,
    };
  });

  beforeEach(() => {
    mockDbService = {
      putItem: jest.fn(),
      getItem: jest.fn(() => dummyDbStarUser),
    };
    mockStarService = {
      getStarPairByUser: jest.fn(() => [dummyStarPair]),
      getStar: jest.fn(() => dummyStar),
    };
    mockValidator = { validateUser: jest.fn() };

    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<StarService>(StarService).toConstantValue(mockStarService);
    bindings.rebind<Validator>(Validator).toConstantValue(mockValidator);

    userService = bindings.get<UserService>(UserService);
  });

  it('getUserById should work', async () => {
    const res: DbUser | null = await userService.getUserById('abc');
    expect(res).toStrictEqual(dummyDbStarUser);
  });

  it('getUserByLineId should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbStarUser]);

    const res: DbUser | null = await userService.getUserByLineId('abc');
    expect(res).toStrictEqual(dummyDbStarUser);
  });

  it('getAllUsers should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbStarUser]);

    const res: DbUser[] = await userService.getAllUsers();
    expect(res).toStrictEqual([dummyDbStarUser]);
  });

  it('getUserByLineId should fail with empty array', async () => {
    mockDbService.query = jest.fn(() => []);

    await expect(userService.getUserByLineId('abc')).rejects.toThrow(
      'user does not exist'
    );
  });

  it('getUserByLineId should fail with abnormal result', async () => {
    mockDbService.query = jest.fn(() => [dummyDbStarUser, dummyDbStarUser]);

    await expect(userService.getUserByLineId('abc')).rejects.toThrow(
      'Get multiple users with same lineUserId'
    );
  });

  it('addUser should work', async () => {
    await userService.addUser(dummyStarUser);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('getWholeUserInfo should work with starUser', async () => {
    mockDbService.query = jest.fn(() => [dummyDbStarUser]);

    const res: DbUser = await userService.getWholeUserInfo('abc');
    expect(res).toStrictEqual({ ...dummyDbStarUser, starInfo: [dummyStar] });
  });

  it('getWholeUserInfo should work with starRainUser', async () => {
    // change starUser to starRainUser
    mockDbService.query = jest.fn(() => [dummyDbStarRainUser]);

    const res: DbUser = await userService.getWholeUserInfo('abc');
    expect(res).toStrictEqual(dummyDbStarRainUser);
  });
});
