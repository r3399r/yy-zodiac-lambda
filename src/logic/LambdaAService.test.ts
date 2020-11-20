import { bindings } from 'src/bindings';
import { LambdaAService } from "./LambdaAService";

/**
 * Tests of the LambdaAService class.
 */
describe('LambdaAService', () => {
  let lambdaAService: LambdaAService;

  beforeEach(() => {
    lambdaAService = bindings.get<LambdaAService>(LambdaAService);
  })

  it('getText should work', async () => {
    const res: string = lambdaAService.getText('test')

    expect(res).toBe('test')
  });
});