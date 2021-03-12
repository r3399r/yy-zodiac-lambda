import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { InputSign } from 'src/model/sadalsuud/Sign';
import { SignService } from 'src/services/SignService';
import { sign } from './sign';
import { SignEvent } from './SignEvent';

/**
 * Tests of the sign function.
 */
describe('sign', () => {
  let event: SignEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockSignService: any;
  let dummyInputSign: InputSign;

  beforeAll(() => {
    dummyInputSign = {
      tripCreationId: 'testTrip',
      lineUserId: 'testLine',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockSignService
    mockSignService = {};
    bindings.rebind<SignService>(SignService).toConstantValue(mockSignService);

    mockSignService.addSign = jest.fn();
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyInputSign),
      pathParameters: null,
    };
    await sign(event, lambdaContext);
    expect(mockSignService.addSign).toBeCalledTimes(1);
  });

  it('POST should fail with null body', async () => {
    event = {
      httpMethod: 'POST',
      body: null,
      pathParameters: null,
    };
    await expect(sign(event, lambdaContext)).rejects.toThrow('null body');
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      body: null,
      pathParameters: null,
    };
    await expect(sign(event, lambdaContext)).rejects.toThrow(
      'unknown http method'
    );
  });
});
