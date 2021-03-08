import { bindings } from 'src/bindings';
import { LineEntity } from 'src/model/DbKey';
import { DbUser, Role } from 'src/model/User';
import { DbService } from './DbService';
import { UserService } from './UserService';

/**
 * Tests of the UserService class.
 */
describe('UserService', (): void => {
  let userService: UserService;
  const mockDbService: any = {};
  let mockDummyItem: DbUser[];

  beforeEach((): void => {
    mockDummyItem = [
      {
        projectEntity: LineEntity.user,
        creationId: 'test',
        lineUserId: 'test',
        role: Role.STAR_RAIN,
        joinSession: 40,
        phone: 'phone',
        trips: [],
      },
    ];

    mockDbService.query = jest.fn(() => mockDummyItem);
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    userService = bindings.get<UserService>(UserService);
  });

  it('getUser should work', async (): Promise<void> => {
    const res: any = await userService.getUser('abc');

    expect(res).toStrictEqual(mockDummyItem[0]);
  });
});
