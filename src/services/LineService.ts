import { Client, TextMessage } from '@line/bot-sdk';
import { inject, injectable } from 'inversify';

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

  public async pushMessage(to: string, text: string): Promise<void> {
    await this.client.pushMessage(to, this.textMessage(text));
  }
}
