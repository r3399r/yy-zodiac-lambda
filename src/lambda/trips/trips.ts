import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { TripsEvent } from 'src/lambda/trips/tripsEvent';
import { DbTrip, Trip } from 'src/model/Trip';
import { TripService } from 'src/services/TripService';

export async function trips(
  event: TripsEvent,
  _context?: LambdaContext
): Promise<any> {
  const tripService: TripService = bindings.get<TripService>(TripService);

  let res: DbTrip | DbTrip[] | PutItemOutput | void;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters !== null) {
        res = await tripService.getTrip(event.pathParameters.tripId);
      } else {
        res = await tripService.getTrips();
      }
      break;
    case 'POST':
      const inputTrip: Trip = JSON.parse(event.body);
      res = await tripService.addTrip(inputTrip);
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
