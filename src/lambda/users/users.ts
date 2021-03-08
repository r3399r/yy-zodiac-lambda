import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbUser, User } from 'src/model/User';
import { UserService } from 'src/services/UserService';
import { successOutput } from 'src/util/LambdaOutput';
import { UsersEvent } from './UsersEvent';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<any> {
  const userService: UserService = bindings.get<UserService>(UserService);

  let res: DbUser | null | void;

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters === null) {
        throw new Error('null path parameter');
      }
      res = await userService.getUser(event.pathParameters.id);
      break;
    case 'POST':
      if (event.body === null) {
        throw new Error('null body');
      }
      const user: User = JSON.parse(event.body);
      res = await userService.addUser(user);
      break;
    default:
      throw new Error('unknown http method');
  }

  return successOutput(res);
}
