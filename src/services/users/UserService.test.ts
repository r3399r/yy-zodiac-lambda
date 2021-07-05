import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { Role } from 'src/model/sadalsuud/User';
import { DbUser, User } from 'src/model/User';
import { DbService } from 'src/services/DbService';
import { Validator } from 'src/Validator';
import { UserService } from './UserService';

/**
 * Tests of the UserService class.
 */
describe('UserService', () => {
  let userService: UserService;
  let mockDbService: any;
  let mockValidator: any;
  let dummyUser: User;
  let dummyDbUser: DbUser;

  beforeAll(() => {
    dummyUser = {
      lineUserId: 'test',
      role: Role.STAR,
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
    mockDbService = {
      putItem: jest.fn(),
      getItem: jest.fn(() => dummyDbUser),
    };
    mockValidator = { validateUser: jest.fn() };

    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<Validator>(Validator).toConstantValue(mockValidator);

    userService = bindings.get<UserService>(UserService);
  });

  it('getUserById should work', async () => {
    const res: DbUser | null = await userService.getUserById('abc');
    expect(res).toStrictEqual(dummyDbUser);
  });

  it('getUserByLineId should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser]);

    const res: DbUser | null = await userService.getUserByLineId('abc');
    expect(res).toStrictEqual(dummyDbUser);
  });

  it('getAllUsers should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser]);

    const res: DbUser[] = await userService.getAllUsers();
    expect(res).toStrictEqual([dummyDbUser]);
  });

  it('getUserByLineId should fail with empty array', async () => {
    mockDbService.query = jest.fn(() => []);

    await expect(userService.getUserByLineId('abc')).rejects.toThrow(
      'user abc does not exist'
    );
  });

  it('getUserByLineId should fail with abnormal result', async () => {
    mockDbService.query = jest.fn(() => [dummyDbUser, dummyDbUser]);

    await expect(userService.getUserByLineId('abc')).rejects.toThrow(
      'Get multiple users with same lineUserId'
    );
  });

  it('addUser should work', async () => {
    await userService.addUser(dummyUser);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('updateUser should work', async () => {
    await userService.updateUser(dummyDbUser);

    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
