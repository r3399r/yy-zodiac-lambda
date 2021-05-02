import { Client, MessageAPIResponseBase, TextMessage } from '@line/bot-sdk';
import { inject, injectable } from 'inversify';
import { PushMessage } from 'src/model/Line';

/**
 * Service class for line message
 */
@injectable()
export class LineService {
  @inject(Client)
  private readonly client!: Client;

  private textMessage(text: string): TextMessage {
    return { type: 'text', text };
  }

  public async pushMessage(
    pushMessage: PushMessage
  ): Promise<MessageAPIResponseBase> {
    const messages: TextMessage[] = pushMessage.messages.map((val: string) =>
      this.textMessage(val)
    );

    return await this.client.pushMessage(pushMessage.to, messages);
  }
}
