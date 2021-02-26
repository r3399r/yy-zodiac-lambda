import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { TripsEvent } from 'src/lambda/trips/tripsEvent';
import { Trip } from 'src/model/Trip';
import { TripService } from 'src/services/TripService';

export async function trips(
  event: TripsEvent,
  _context?: LambdaContext
): Promise<any> {
  // console.log(event);
  // console.log(JSON.parse(event.body));
  // console.log(process.env)
  const tripService: TripService = bindings.get<TripService>(TripService);

  let res: Trip | Trip[] | PutItemOutput | void | null;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters !== null) {
        res = await tripService.getTrip(event.pathParameters.id);
      } else {
        res = await tripService.getTrips();
      }
      break;
    case 'POST':
      console.log('post');
      // need to add check input type

      // const trip: Trip = {
      //   id: Date.now().toString(16),
      //   type: 'official',
      //   status: 'pass',
      //   startDate: new Date('2020-2-28 09:00').toISOString(),
      //   endDate: new Date('2020-2-28 16:00').toISOString(),
      //   place: '內湖',
      //   meetPlace: '大湖公園站',
      //   fee: 16,
      //   participants: ['anotherUser'],
      //   needFamilyAccompany: NeedFamilyAccompany.YES,
      //   quota: 1,
      //   shortDesc: 'hello',
      //   detailedDesc: 'hello world',
      // };
      const inputTrip: Trip = JSON.parse(event.body);
      inputTrip.id = Date.now().toString(16);
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
