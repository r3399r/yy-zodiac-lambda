import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip, NeedFamilyAccompany, Trip } from 'src/model/sadalsuud/Trip';
import { Role, User } from 'src/model/sadalsuud/User';
import { TripValidator } from 'src/validator/TripValidator';
import { DbService } from './DbService';
import { TripService } from './TripService';
import { UserService } from './UserService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;
  let mockUserService: any;
  let mockTripValidator: any;
  let dummyTrip: Trip;
  let dummyDbTrip: DbTrip;
  let dummyUser: User;

  beforeEach(() => {
    dummyTrip = {
      type: 'official',
      status: 'pass',
      startDate: '2000-01-01T00:00:00.000Z',
      endDate: '2000-01-01T00:00:00.000Z',
      place: 'here',
      meetPlace: 'there',
      dismissPlace: 'there2',
      fee: '$10',
      participants: ['abcd'],
      needFamilyAccompany: NeedFamilyAccompany.YES,
      quota: 2,
      shortDesc: 'short',
      detailedDesc: 'detailed',
      expiredDate: '2000-01-01T00:00:00.000Z',
    };
    dummyDbTrip = {
      projectEntity: SadalsuudEntity.trip,
      creationId: 'testId',
      ...dummyTrip,
    };
    dummyUser = {
      lineUserId: 'test',
      role: Role.STAR_RAIN,
      joinSession: 40,
      phone: 'phone',
      name: 'testName',
      status: 'testStatus',
    };

    mockDbService = {
      query: jest.fn(() => [dummyDbTrip]),
      putItem: jest.fn(),
    };
    mockUserService = {};
    mockTripValidator = { validateTrip: jest.fn() };

    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings
      .rebind<TripValidator>(TripValidator)
      .toConstantValue(mockTripValidator);

    tripService = bindings.get<TripService>(TripService);
  });

  it('getTrips should work', async () => {
    const res: DbTrip[] = await tripService.getTrips();
    expect(res).toStrictEqual([dummyDbTrip]);
  });

  it('getTrip should work', async () => {
    mockDbService.getItem = jest.fn(() => dummyDbTrip);
    mockUserService.getUserById = jest.fn(() => dummyUser);

    const res: DbTrip | null = await tripService.getTrip('abc');
    expect(res).toStrictEqual(dummyDbTrip);
  });

  it('getTrip should return null', async () => {
    mockDbService.getItem = jest.fn(() => null);

    const res: DbTrip | null = await tripService.getTrip('abc');
    expect(res).toBeNull();
  });

  it('getTrip should fail if participant does not exists', async () => {
    mockDbService.getItem = jest.fn(() => dummyDbTrip);
    mockUserService.getUserById = jest.fn(() => null);

    await expect(tripService.getTrip('abc')).rejects.toThrow(
      new Error('user abcd is not found')
    );
  });

  it('addTrip should work', async () => {
    await tripService.addTrip(dummyTrip);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
