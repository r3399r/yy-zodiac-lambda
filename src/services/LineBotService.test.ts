import { Client } from '@line/bot-sdk';
import { bindings } from 'src/bindings';
import { PushMessage } from 'src/model/Line';
import { LineBotService } from './LineBotService';

/**
 * Tests of the LineBotService class.
 */
describe('LineBotService', () => {
  let lineBotService: LineBotService;
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

    lineBotService = bindings.get<LineBotService>(LineBotService);
  });

  it('pushMessage should work', async () => {
    mockClient.pushMessage = jest.fn();

    await lineBotService.pushMessage(dummyPushMessage);
    expect(mockClient.pushMessage).toBeCalledTimes(1);
  });
});
