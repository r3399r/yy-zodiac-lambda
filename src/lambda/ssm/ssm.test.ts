import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { ssm } from 'src/lambda/ssm/ssm';
import { SsmEvent } from 'src/lambda/ssm/SsmEvent';
import { SsmService } from 'src/services/SsmService';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';

/**
 * Tests of the ssm function.
 */
describe('ssm', () => {
  let event: SsmEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockSsmService: any;
  let dummyResult: { [key: string]: string };

  beforeAll(() => {
    dummyResult = {
      a: '123',
      b: 'abc',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockUserService
    mockSsmService = {};
    bindings.rebind<SsmService>(SsmService).toConstantValue(mockSsmService);

    mockSsmService.getParameters = jest.fn(() => dummyResult);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      queryStringParameters: { name: 'test' },
    };
    await expect(ssm(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyResult)
    );
    expect(mockSsmService.getParameters).toBeCalledTimes(1);
  });

  it('GET should fail with null query string', async () => {
    event = {
      httpMethod: 'GET',
      queryStringParameters: null,
    };
    await expect(ssm(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null query string parameters'))
    );
  });

  it('GET should fail without parameter name', async () => {
    event = {
      httpMethod: 'GET',
      queryStringParameters: {},
    };
    await expect(ssm(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('missing parameter name'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      queryStringParameters: null,
    };
    await expect(ssm(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
