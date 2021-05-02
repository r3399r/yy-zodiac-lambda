import { MessageAPIResponseBase } from '@line/bot-sdk';
import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { PushMessage } from 'src/model/Line';
import { LineService } from 'src/services/LineService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { LineEvent } from './LineEvent';

export async function line(
  event: LineEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const lineService: LineService = bindings.get<LineService>(LineService);

    let res: MessageAPIResponseBase;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const body: PushMessage = JSON.parse(event.body);
        res = await lineService.pushMessage(body);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
