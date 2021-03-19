import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { StarService } from 'src/services/StarService';
import { LambdaOutput, successOutput } from 'src/util/LambdaOutput';
import { StarsBody, StarsEvent } from './StarsEvent';

export async function stars(
  event: StarsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  console.log(event);
  const starService: StarService = bindings.get<StarService>(StarService);

  let res: null | void;

  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null) throw new Error('null body');

      const star: StarsBody = JSON.parse(event.body);
      console.log(star);
      res = await starService.addStar(star.star, star.familyMembers);
      break;
    default:
      throw new Error('unknown http method');
  }

  return successOutput(res);
}
