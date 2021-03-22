import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { DbStar, Star } from 'src/model/sadalsuud/Star';
import { StarService } from 'src/services/StarService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';
import { StarsEvent } from './StarsEvent';

export async function stars(
  event: StarsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const starService: StarService = bindings.get<StarService>(StarService);

    let res: DbStar;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const star: Star = JSON.parse(event.body);
        res = await starService.addStar(star);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
