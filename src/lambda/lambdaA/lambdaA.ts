import { bindings } from 'src/bindings';
import { LambdaAEvent } from 'src/lambda/lambdaA/lambdaAEvent';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { LambdaAService } from 'src/logic/LambdaAService';

export async function lambdaA(
  event: LambdaAEvent,
  _context?: LambdaContext
): Promise<string> {
  const lambdAService: LambdaAService = bindings.get<LambdaAService>(
    LambdaAService
  );
  return lambdAService.getText(event.text);
}
