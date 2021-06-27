import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { me } from 'src/lambda/me/me';
import { LineLoginService } from 'src/services/LineLoginService';
import { MeService } from 'src/services/MeService';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';
import { MeEvent } from './MeEvent';

/**
 * Tests of the me function.
 */
describe('me', () => {
  let event: MeEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockMeService: any;
  let mockLineLoginService: any;
  let dummyResult: { [key: string]: string };

  beforeAll(() => {
    dummyResult = {
      id: '1d23xxxxx',
      lineUserId: '43rds6xxx',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // mock mockMeService
    mockMeService = {};
    bindings.rebind<MeService>(MeService).toConstantValue(mockMeService);

    mockMeService.getMe = jest.fn(() => dummyResult);

    // mock mockLineLoginService
    mockLineLoginService = {};
    bindings
      .rebind<LineLoginService>(LineLoginService)
      .toConstantValue(mockLineLoginService);

    mockLineLoginService.verifyToken = jest.fn();
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      headers: { 'x-api-line': 'abcdefg' },
    };
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyResult)
    );
    expect(mockLineLoginService.verifyToken).toBeCalledTimes(1);
    expect(mockMeService.getMe).toBeCalledTimes(1);
  });

  it('GET should fail when verify token failed', async () => {
    event = {
      httpMethod: 'GET',
      headers: {},
    };
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('missing authentication token'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      headers: { 'x-api-line': 'abcdefg' },
    };
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
