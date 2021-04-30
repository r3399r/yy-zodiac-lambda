import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbSign, Sign } from 'src/model/sadalsuud/Sign';
import { SignService } from 'src/services/SignService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { SignEvent } from './SignEvent';

export async function sign(
  event: SignEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const signService: SignService = bindings.get<SignService>(SignService);

    let res: DbSign | DbSign[];

    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters === null)
          throw new Error('null query string parameters');
        if (event.queryStringParameters.tripId === undefined)
          throw new Error('missing tripId');
        res = await signService.getSign(event.queryStringParameters.tripId);
        break;
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const newSign: Sign = JSON.parse(event.body);
        res = await signService.addSign(newSign);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
