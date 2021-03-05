import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
// import { User } from 'src/model/User';
import { UserService } from 'src/services/UserService';
import { UsersEvent } from './usersEvent';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<any> {
  const userService: UserService = bindings.get<UserService>(UserService);

  const user: any = await userService.getUser(
    event.queryStringParameters.userId
  );

  switch (event.httpMethod) {
    case 'GET':
      // if (event.pathParameters !== null) {
      //   res = await tripService.getTrip(event.pathParameters.tripId);
      // } else {
      //   res = await tripService.getTrips();
      // }
      break;
    case 'POST':
      // const thisUser: User = JSON.parse(event.body);
      // res = await tripService.addTrip(inputTrip);
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
    body: JSON.stringify(user),
  };
}
