import { bindings } from 'src/bindings';
import { UsersEvent } from 'src/lambda/altarf/users/UsersEvent';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { UpdateUserParams, User } from 'src/model/altarf/User';
import { DbUser } from 'src/model/User';
import { LineLoginService } from 'src/services/LineLoginService';
import { AltarfUserService } from 'src/services/users/AltarfUserService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const altarfUserService: AltarfUserService = bindings.get<AltarfUserService>(
      AltarfUserService
    );
    const lineLoginService: LineLoginService = bindings.get<LineLoginService>(
      LineLoginService
    );

    let res: DbUser;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const newUser: User = JSON.parse(event.body);
        res = await altarfUserService.addUser(newUser);
        break;
      case 'PUT':
        if (event.body === null) throw new Error('null body');
        if (event.headers['x-api-line'] === undefined)
          throw new Error('missing line authentication token');

        const lineUser = await lineLoginService.verifyAndGetUser(
          event.headers['x-api-line']
        );

        const params: UpdateUserParams = JSON.parse(event.body);
        res = await altarfUserService.updateUser(lineUser.userId, params);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
