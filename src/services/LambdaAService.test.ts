import { bindings } from 'src/bindings';
import { LambdaAService } from './LambdaAService';

/**
 * Tests of the LambdaAService class.
 */
describe('LambdaAService', (): void => {
  let lambdaAService: LambdaAService;

  beforeEach((): void => {
    lambdaAService = bindings.get<LambdaAService>(LambdaAService);
  });

  it('getText should work', async (): Promise<void> => {
    const res: string = lambdaAService.getText('test');

    expect(res).toBe('test');
  });
});
