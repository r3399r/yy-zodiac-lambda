import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip, Trip } from 'src/model/sadalsuud/Trip';
import { DbService } from './DbService';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;
  let dummyTrips: Trip[];
  let dummyDbTrips: DbTrip[];

  beforeAll(() => {
    dummyTrips = [
      {
        type: 'official',
        status: 'pass',
        startDate: new Date(
          new Date().valueOf() - 1000 * 3600 * 24
        ).toISOString(),
        endDate: new Date(
          new Date().valueOf() - 1000 * 3600 * 24
        ).toISOString(),
        place: 'here',
        meetPlace: 'there',
        fee: '$10',
        participants: [],
        needFamilyAccompany: 'yes',
        quota: 2,
        shortDesc: 'short',
        detailedDesc: 'detailed',
        expiredDate: new Date(
          new Date().valueOf() - 1000 * 3600 * 24
        ).toISOString(),
      },
      {
        type: 'official',
        status: 'pass',
        startDate: new Date(
          new Date().valueOf() + 1000 * 3600 * 24
        ).toISOString(),
        endDate: new Date(
          new Date().valueOf() + 1000 * 3600 * 24
        ).toISOString(),
        place: 'here',
        meetPlace: 'there',
        fee: '$10',
        participants: [],
        needFamilyAccompany: 'yes',
        quota: 2,
        shortDesc: 'short',
        detailedDesc: 'detailed',
        expiredDate: new Date(
          new Date().valueOf() + 1000 * 3600 * 24
        ).toISOString(),
      },
    ];
    dummyDbTrips = [
      {
        projectEntity: SadalsuudEntity.trip,
        creationId: 'testId',
        ...dummyTrips[0],
      },
      {
        projectEntity: SadalsuudEntity.trip,
        creationId: 'testId',
        ...dummyTrips[1],
      },
    ];
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    tripService = bindings.get<TripService>(TripService);
  });

  it('getTrips should work', async () => {
    mockDbService.query = jest.fn(() => dummyDbTrips);

    const res: DbTrip[] = await tripService.getTrips();
    expect(res).toStrictEqual([dummyDbTrips[1]]);
  });

  it('getTrip should work', async () => {
    mockDbService.getItem = jest.fn(() => dummyDbTrips[0]);

    const res: DbTrip = await tripService.getTrip('abc');
    expect(res).toStrictEqual(dummyDbTrips[0]);
  });

  it('addTrip should work', async () => {
    mockDbService.putItem = jest.fn();

    await tripService.addTrip(dummyTrips[0]);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
