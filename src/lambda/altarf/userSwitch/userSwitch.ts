import { bindings } from 'src/bindings';
import { UserSwitchEvent } from 'src/lambda/altarf/userSwitch/UserSwitchEvent';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbUser } from 'src/model/User';
import { AltarfUserService } from 'src/services/users/AltarfUserService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';

export async function userSwitch(
  event: UserSwitchEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const altarfUserService: AltarfUserService = bindings.get<AltarfUserService>(
      AltarfUserService
    );

    let res: DbUser;

    switch (event.httpMethod) {
      case 'PUT':
        if (event.pathParameters === null)
          throw new Error('null path parameter');
        if (event.pathParameters.id === undefined)
          throw new Error('missing user id');

        res = await altarfUserService.switchRole(event.pathParameters.id);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
