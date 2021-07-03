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
      enrollmentYear: 999,
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
    };
    mockValidator = { validateAltarfUser: jest.fn() };

    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings.rebind<Validator>(Validator).toConstantValue(mockValidator);

    altarfUserService = bindings.get<AltarfUserService>(AltarfUserService);
  });

  it('addUser with role student should work', async () => {
    const res: DbUser = await altarfUserService.addUser(dummyUser);

    expect(res).toStrictEqual(dummyDbUser);
    expect(mockValidator.validateAltarfUser).toBeCalledTimes(1);
    expect(mockUserService.addUser).toBeCalledTimes(1);
  });

  it('addUser with role teacher should work', async () => {
    const res: DbUser = await altarfUserService.addUser({
      lineUserId: 'test',
      role: Role.TEACHER,
      name: 'testName2',
    });

    expect(res).toStrictEqual(dummyDbUser);
  });
});
