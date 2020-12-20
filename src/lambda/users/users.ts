import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { LambdaAService } from 'src/services/LambdaAService';
import { UsersEvent } from './usersEvent';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<string> {
  const lambdAService: LambdaAService = bindings.get<LambdaAService>(
    LambdaAService
  );

  return lambdAService.getText(event.text);
}
