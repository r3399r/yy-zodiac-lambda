import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbTrip, Trip } from 'src/model/sadalsuud/Trip';
import { TripService } from 'src/services/TripService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { TripsEvent } from './TripsEvent';

export async function trips(
  event: TripsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const tripService: TripService = bindings.get<TripService>(TripService);

    let res: DbTrip | DbTrip[] | null;

    switch (event.httpMethod) {
      case 'GET':
        if (event.pathParameters !== null)
          res = await tripService.getTrip(event.pathParameters.id);
        else res = await tripService.getTrips();
        break;
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const trip: Trip = JSON.parse(event.body);
        res = await tripService.addTrip(trip);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
