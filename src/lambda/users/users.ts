import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { User } from 'src/model/User';
import { UserService } from 'src/services/UserService';
import { UsersEvent } from './usersEvent';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<any> {
  console.log(event);
  const userService: UserService = bindings.get<UserService>(UserService);

  let res: any;

  switch (event.httpMethod) {
    case 'GET':
      res = await userService.getUser(event.pathParameters.id);
      break;
    case 'POST':
      if (event.body === null) {
        throw new Error('null body');
      }
      const user: User = JSON.parse(event.body);
      res = await userService.addUser(user);
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
