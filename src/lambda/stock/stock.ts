import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { StockService } from 'src/services/StockService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { StockEvent } from './StockEvent';

export async function stock(
  event: StockEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const stockService: StockService = bindings.get<StockService>(StockService);

    let res: any;

    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters?.stockId === undefined)
          throw new Error('stockId is required');
        res = await stockService.getStockInfo(
          event.queryStringParameters?.stockId
        );
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
