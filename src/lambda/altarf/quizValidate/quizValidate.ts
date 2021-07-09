import { bindings } from 'src/bindings';
import { QuizValidateEvent } from 'src/lambda/altarf/quizValidate/QuizValidateEvent';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { LineLoginService } from 'src/services/LineLoginService';
import { QuizService } from 'src/services/QuizService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';

export async function quizValidate(
  event: QuizValidateEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const quizService: QuizService = bindings.get<QuizService>(QuizService);
    const lineLoginService: LineLoginService = bindings.get<LineLoginService>(
      LineLoginService
    );

    let res: any;

    switch (event.httpMethod) {
      case 'GET':
        if (event.headers['x-api-line'] === undefined)
          throw new Error('missing line authentication token');
        if (event.pathParameters === null)
          throw new Error('null path parameter');
        if (event.pathParameters.id === undefined)
          throw new Error('missing user id');

        const lineUser = await lineLoginService.verifyAndGetUser(
          event.headers['x-api-line']
        );

        res = await quizService.validate(
          lineUser.userId,
          event.pathParameters.id
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
