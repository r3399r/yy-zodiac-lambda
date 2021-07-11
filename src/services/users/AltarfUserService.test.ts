import { bindings } from 'src/bindings';
import { Role, User } from 'src/model/altarf/User';
import { AltarfEntity, SadalsuudEntity } from 'src/model/DbKey';
import { Role as OtherRole } from 'src/model/sadalsuud/User';
import { DbUser } from 'src/model/User';
import { DbService } from 'src/services/DbService';
import { Validator } from 'src/Validator';
import { AltarfUserService } from './AltarfUserService';
import { UserService } from './UserService';

/**
 * Tests of the AltarfUserService class.
 */
describe('AltarfUserService', () => {
  let altarfUserService: AltarfUserService;
  let mockUserService: any;
  let mockDbService: any;
  let mockValidator: any;
  let dummyStudent: User;
  let dummyDbStudent: DbUser;
  let dummyDbTeacher: DbUser;

  beforeAll(() => {
    dummyStudent = {
      lineUserId: 'test',
      role: Role.STUDENT,
      name: 'testName',
    };
    dummyDbStudent = {
      projectEntity: AltarfEntity.user,
      creationId: 'test',
      ...dummyStudent,
    };
    dummyDbTeacher = {
      projectEntity: AltarfEntity.user,
      creationId: 'test',
      lineUserId: 'test',
      role: Role.TEACHER,
      name: 'testName',
    };
  });

  beforeEach(() => {
    mockUserService = {
      addUser: jest.fn(() => dummyDbStudent),
      updateUser: jest.fn(() => dummyDbStudent),
      getUserByLineId: jest.fn(() => dummyDbStudent),
      getUserById: jest.fn(() => dummyDbStudent),
    };
    mockDbService = {
      query: jest.fn(() => []),
      putItem: jest.fn(),
    };
    mockValidator = {
      validateAltarfUser: jest.fn(),
      validateUpdateUserParams: jest.fn(),
    };

    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<Validator>(Validator).toConstantValue(mockValidator);

    altarfUserService = bindings.get<AltarfUserService>(AltarfUserService);
  });

  it('addUser should work', async () => {
    const res: DbUser = await altarfUserService.addUser(dummyStudent);

    expect(res).toStrictEqual(dummyDbStudent);
    expect(mockValidator.validateAltarfUser).toBeCalledTimes(1);
    expect(mockUserService.addUser).toBeCalledTimes(1);
  });

  it('switchRole should work', async () => {
    await altarfUserService.switchRole('123');

    expect(mockUserService.getUserByLineId).toBeCalledTimes(1);
    expect(mockUserService.updateUser).toBeCalledTimes(1);

    mockUserService.getUserByLineId = jest.fn(() => dummyDbTeacher);
    await altarfUserService.switchRole('123');
  });

  it('updateUser should work with student', async () => {
    await altarfUserService.updateUser('123', {
      name: 'testname',
    });
    expect(mockUserService.updateUser).toBeCalledTimes(1);

    await altarfUserService.updateUser('123', {});

    await expect(
      altarfUserService.updateUser('123', {
        classroom: 'test',
      })
    ).rejects.toThrow('role student should not have classroom attribute');

    await expect(
      altarfUserService.updateUser('123', {
        spreadsheetId: 'test',
      })
    ).rejects.toThrow('role student should not have spreadsheetId attribute');
  });

  it('updateUser should work with teacher', async () => {
    mockUserService.getUserByLineId = jest.fn(() => dummyDbTeacher);
    await altarfUserService.updateUser('123', {
      name: 'testname',
      classroom: 'test',
      spreadsheetId: 'test',
    });
    expect(mockUserService.updateUser).toBeCalledTimes(1);

    await altarfUserService.updateUser('123', {});
  });

  it('updateUser should fail with unexpected role', async () => {
    const dummyUser: DbUser = {
      role: OtherRole.VOLUNTEER,
      lineUserId: 'test',
      name: 'test',
      phone: 'test',
      status: 'test',
      projectEntity: SadalsuudEntity.user,
      creationId: 'test',
    };
    mockUserService.getUserByLineId = jest.fn(() => dummyUser);
    await expect(
      altarfUserService.updateUser('123', {
        name: 'testname',
      })
    ).rejects.toThrow('unexpected role');
  });

  it('addStudents should work', async () => {
    mockUserService.getUserByLineId = jest.fn((id: string) =>
      id === 'a' ? dummyDbTeacher : dummyDbStudent
    );

    await altarfUserService.addStudents('a', ['b', 'c']);
    expect(mockUserService.getUserByLineId).toBeCalledTimes(1);
  });

  it('addStudents should fail when wrong role', async () => {
    await expect(
      altarfUserService.addStudents('a', ['b', 'c'])
    ).rejects.toThrow('role of a is not teacher');

    mockUserService.getUserByLineId = jest.fn(() => dummyDbTeacher);
    mockUserService.getUserById = jest.fn(() => dummyDbTeacher);
    await expect(
      altarfUserService.addStudents('a', ['b', 'c'])
    ).rejects.toThrow('role of b is not student');
  });

  it('addStudents should fail when pair exists', async () => {
    mockUserService.getUserByLineId = jest.fn((id: string) =>
      id === 'a' ? dummyDbTeacher : dummyDbStudent
    );
    mockDbService.query = jest.fn(() => ['any']);

    await expect(
      altarfUserService.addStudents('a', ['b', 'c'])
    ).rejects.toThrow('pair of teacher test and student b already exists');
  });
});
