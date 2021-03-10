import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip, Trip } from 'src/model/Trip';
import { DbService } from './DbService';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;
  let dummyTrip: Trip;
  let dummyDbTrip: DbTrip;

  beforeAll(() => {
    dummyTrip = {
      type: 'official',
      status: 'pass',
      startDate: '2020-02-28T20:00:00.000Z',
      endDate: '2020-02-28T20:00:00.000Z',
      place: 'here',
      meetPlace: 'there',
      fee: 10,
      participants: [],
      needFamilyAccompany: 'yes',
      quota: 2,
      shortDesc: 'short',
      detailedDesc: 'detailed',
      expiredDate: '2020-02-28T20:00:00.000Z',
    };
    dummyDbTrip = {
      projectEntity: SadalsuudEntity.trip,
      creationId: 'testId',
      ...dummyTrip,
    };
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    tripService = bindings.get<TripService>(TripService);
  });

  it('getTrips should work', async () => {
    mockDbService.query = jest.fn(() => [dummyDbTrip]);

    const res: DbTrip[] = await tripService.getTrips();
    expect(res).toStrictEqual([dummyDbTrip]);
  });

  it('getTrip should work', async () => {
    mockDbService.getItem = jest.fn(() => dummyDbTrip);

    const res: DbTrip = await tripService.getTrip('abc');
    expect(res).toStrictEqual(dummyDbTrip);
  });

  it('addTrip should work', async () => {
    mockDbService.putItem = jest.fn();

    await tripService.addTrip(dummyTrip);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
