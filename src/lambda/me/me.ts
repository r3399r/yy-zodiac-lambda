import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { LineLoginService } from 'src/services/LineLoginService';
import { MeService } from 'src/services/MeService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { MeEvent } from './MeEvent';

export async function me(
  event: MeEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const lineLoginService: LineLoginService = bindings.get<LineLoginService>(
      LineLoginService
    );

    if (event.headers['x-api-line'] === undefined)
      throw new Error('missing authentication token');
    await lineLoginService.verifyToken(event.headers['x-api-line']);

    const meService: MeService = bindings.get<MeService>(MeService);

    let res: any;

    switch (event.httpMethod) {
      case 'GET':
        res = await meService.getMe();
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
