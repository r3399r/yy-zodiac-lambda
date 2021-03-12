import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip } from 'src/model/sadalsuud/Trip';
import { TripService } from 'src/services/TripService';
import { successOutput } from 'src/util/LambdaOutput';
import { trips } from './trips';
import { TripsEvent } from './TripsEvent';

/**
 * Tests of the trips function.
 */
describe('trips', () => {
  let event: TripsEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockTripService: any;
  let dummyTrip: DbTrip;

  beforeAll(() => {
    dummyTrip = {
      projectEntity: SadalsuudEntity.trip,
      creationId: 'testId',
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
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockTripService
    mockTripService = {};
    bindings.rebind<TripService>(TripService).toConstantValue(mockTripService);

    mockTripService.getTrip = jest.fn(() => dummyTrip);
    mockTripService.getTrips = jest.fn(() => [dummyTrip]);
    mockTripService.addTrip = jest.fn();
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummyTrip])
    );
    expect(mockTripService.getTrips).toBeCalledTimes(1);
  });

  it('GET/{id} should work', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      pathParameters: { id: 'abc' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.getTrip).toBeCalledTimes(1);
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyTrip),
      pathParameters: null,
    };
    await trips(event, lambdaContext);
    expect(mockTripService.addTrip).toBeCalledTimes(1);
  });

  it('POST should fail with null body', async () => {
    event = {
      httpMethod: 'POST',
      body: null,
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).rejects.toThrow('null body');
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      body: null,
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).rejects.toThrow(
      'unknown http method'
    );
  });
});
