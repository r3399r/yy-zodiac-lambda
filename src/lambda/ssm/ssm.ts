import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { SsmService } from 'src/services/SsmService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { SsmEvent } from './SsmEvent';

export async function ssm(
  event: SsmEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const ssmService: SsmService = bindings.get<SsmService>(SsmService);

    let res: { [key: string]: string };

    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters === null)
          throw new Error('null query string parameters');
        if (event.queryStringParameters.name === undefined)
          throw new Error('missing parameter name');

        res = ssmService.getParameters(event.queryStringParameters.name);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
