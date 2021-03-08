import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { InputSign } from 'src/model/Sign';
import { SignService } from 'src/services/SignService';
import { SignEvent } from './SignEvent';

export async function sign(
  event: SignEvent,
  _context?: LambdaContext
): Promise<any> {
  const signService: SignService = bindings.get<SignService>(SignService);

  let res: string | void;

  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null) {
        throw new Error('null body');
      }
      const newSign: InputSign = JSON.parse(event.body);
      res = await signService.addSign(newSign);
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
