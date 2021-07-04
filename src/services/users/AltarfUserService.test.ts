import { bindings } from 'src/bindings';
import { Role, User } from 'src/model/altarf/User';
import { AltarfEntity } from 'src/model/DbKey';
import { DbUser } from 'src/model/User';
import { Validator } from 'src/Validator';
import { AltarfUserService } from './AltarfUserService';
import { UserService } from './UserService';

/**
 * Tests of the AltarfUserService class.
 */
describe('AltarfUserService', () => {
  let altarfUserService: AltarfUserService;
  let mockUserService: any;
  let mockValidator: any;
  let dummyUser: User;
  let dummyDbUser: DbUser;

  beforeAll(() => {
    dummyUser = {
      lineUserId: 'test',
      role: Role.STUDENT,
      name: 'testName',
    };
    dummyDbUser = {
      projectEntity: AltarfEntity.user,
      creationId: 'test',
      ...dummyUser,
    };
  });

  beforeEach(() => {
    mockUserService = {
      addUser: jest.fn(() => dummyDbUser),
      updateUser: jest.fn(() => dummyDbUser),
      getUserByLineId: jest.fn(() => dummyDbUser),
    };
    mockValidator = { validateAltarfUser: jest.fn() };

    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings.rebind<Validator>(Validator).toConstantValue(mockValidator);

    altarfUserService = bindings.get<AltarfUserService>(AltarfUserService);
  });

  it('addUser should work', async () => {
    const res: DbUser = await altarfUserService.addUser(dummyUser);

    expect(res).toStrictEqual(dummyDbUser);
    expect(mockValidator.validateAltarfUser).toBeCalledTimes(1);
    expect(mockUserService.addUser).toBeCalledTimes(1);
  });

  it('switchRole should work', async () => {
    await altarfUserService.switchRole('123');

    expect(mockUserService.getUserByLineId).toBeCalledTimes(1);
    expect(mockUserService.updateUser).toBeCalledTimes(1);

    dummyDbUser.role = Role.TEACHER;
    await altarfUserService.switchRole('123');
  });
});
