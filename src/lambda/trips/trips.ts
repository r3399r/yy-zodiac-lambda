import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbTrip, Trip } from 'src/model/Trip';
import { TripService } from 'src/services/TripService';
import { TripsEvent } from './TripEvent';

export async function trips(
  event: TripsEvent,
  _context?: LambdaContext
): Promise<any> {
  const tripService: TripService = bindings.get<TripService>(TripService);

  let res: DbTrip | DbTrip[] | PutItemOutput | void;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters !== null) {
        res = await tripService.getTrip(event.pathParameters.id);
      } else {
        res = await tripService.getTrips();
      }
      break;
    case 'POST':
      if (event.body === null) {
        throw new Error('null body');
      }
      const trip: Trip = JSON.parse(event.body);
      res = await tripService.addTrip(trip);
      break;
    case 'PUT':
      console.log('put');
      break;
    default:
      throw new Error('unknown http method');
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(res),
  };
}
