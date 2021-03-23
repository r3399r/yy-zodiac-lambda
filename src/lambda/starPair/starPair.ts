import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbStarPair, StarPair } from 'src/model/sadalsuud/StarPair';
import { StarService } from 'src/services/StarService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { StarPairEvent } from './StarPairEvent';

export async function starPair(
  event: StarPairEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const starService: StarService = bindings.get<StarService>(StarService);

    let res: DbStarPair;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const inputStarPair: StarPair = JSON.parse(event.body);
        res = await starService.addStarPair(inputStarPair);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
