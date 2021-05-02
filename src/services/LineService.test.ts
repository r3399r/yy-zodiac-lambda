import { Client } from '@line/bot-sdk';
import { bindings } from 'src/bindings';
import { PushMessage } from 'src/model/Line';
import { LineService } from './LineService';

/**
 * Tests of the LineService class.
 */
describe('LineService', () => {
  let lineService: LineService;
  let mockClient: any;
  let dummyPushMessage: PushMessage;

  beforeAll(() => {
    dummyPushMessage = {
      to: 'to',
      messages: ['1message', '2message'],
    };
  });

  beforeEach(() => {
    mockClient = {};
    bindings.rebind<Client>(Client).toConstantValue(mockClient);

    lineService = bindings.get<LineService>(LineService);
  });

  it('pushMessage should work', async () => {
    mockClient.pushMessage = jest.fn();

    await lineService.pushMessage(dummyPushMessage);
    expect(mockClient.pushMessage).toBeCalledTimes(1);
  });
});
