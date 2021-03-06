import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { PushMessage } from 'src/model/Line';
import { LineBotService } from 'src/services/LineBotService';
import { errorOutput } from 'src/util/LambdaOutput';
import { line } from './line';
import { LineEvent } from './LineEvent';

/**
 * Tests of the sign function.
 */
describe('line', () => {
  let event: LineEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockLineBotService: any;
  let dummyPushMessage: PushMessage;

  beforeAll(() => {
    dummyPushMessage = {
      to: 'to',
      messages: ['1message', '2message'],
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockLineService
    mockLineBotService = { pushMessage: jest.fn() };
    bindings
      .rebind<LineBotService>(LineBotService)
      .toConstantValue(mockLineBotService);
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyPushMessage),
    };
    await line(event, lambdaContext);
    expect(mockLineBotService.pushMessage).toBeCalledTimes(1);
  });

  it('POST should fail with null body', async () => {
    event = {
      httpMethod: 'POST',
      body: null,
    };
    await expect(line(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      body: null,
    };
    await expect(line(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
