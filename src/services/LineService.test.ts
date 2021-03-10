import { Client } from '@line/bot-sdk';
import { bindings } from 'src/bindings';
import { LineService } from './LineService';

/**
 * Tests of the LineService class.
 */
describe('LineService', () => {
  let lineService: LineService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {};
    bindings.rebind<Client>(Client).toConstantValue(mockClient);

    lineService = bindings.get<LineService>(LineService);
  });

  it('pushMessage should work', async () => {
    mockClient.pushMessage = jest.fn();

    await lineService.pushMessage('to', 'text');
    expect(mockClient.pushMessage).toBeCalledTimes(1);
  });
});
