import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
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

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
}
