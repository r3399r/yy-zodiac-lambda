import { bindings } from 'src/bindings';
import { lambdaA } from 'src/lambda/lambdaA/lambdaA';
import { LambdaAEvent } from 'src/lambda/lambdaA/lambdaAEvent';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { LambdaAService } from 'src/logic/LambdaAService';
/**
 * Tests of the lambda A function.
 */
describe('lambdaA', (): void => {
  let event: LambdaAEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockLambdaAService: any;

  beforeEach((): void => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockLambdaAService
    mockLambdaAService = {};
    bindings
      .rebind<LambdaAService>(LambdaAService)
      .toConstantValue(mockLambdaAService);

    const mockGetText: jest.Mock = jest.fn((input:string): string => input);

    mockLambdaAService.getText = mockGetText;
  });

  it('function should work', async (): Promise<void> => {
    event = {
      text: 'test',
      digit: 3,
    };
    await expect(lambdaA(event, lambdaContext)).resolves.toBe('test');
    expect(mockLambdaAService.getText).toBeCalledTimes(1);
  });
});
