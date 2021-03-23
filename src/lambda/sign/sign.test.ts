import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { InputSign } from 'src/model/sadalsuud/Sign';
import { SignService } from 'src/services/SignService';
import { errorOutput } from 'src/util/LambdaOutput';
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
      tripId: 'testTrip',
      lineUserId: 'testLine',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockSignService
    mockSignService = { addSign: jest.fn(), getSign: jest.fn() };
    bindings.rebind<SignService>(SignService).toConstantValue(mockSignService);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      queryStringParameters: { tripId: 'tripId' },
    };
    await sign(event, lambdaContext);
    expect(mockSignService.getSign).toBeCalledTimes(1);
  });

  it('GET should fail with null query string parameters', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      queryStringParameters: null,
    };
    await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null query string parameters'))
    );
  });

  it('GET should fail withoupt tripId', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      queryStringParameters: {},
    };
    await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('missing tripId'))
    );
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyInputSign),
      queryStringParameters: null,
    };
    await sign(event, lambdaContext);
    expect(mockSignService.addSign).toBeCalledTimes(1);
  });

  it('POST should fail with null body', async () => {
    event = {
      httpMethod: 'POST',
      body: null,
      queryStringParameters: null,
    };
    await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      body: null,
      queryStringParameters: null,
    };
    await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
