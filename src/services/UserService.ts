import { DynamoDB } from 'aws-sdk';
import {
  Converter,
  GetItemInput,
  GetItemOutput,
} from 'aws-sdk/clients/dynamodb';
import { inject, injectable } from 'inversify';
/**
 * Service class for user
 */
@injectable()
export class UserService {
  @inject(DynamoDB)
  private readonly dynamoDb!: DynamoDB;

  public async getUser(userId: string): Promise<any> {
    const key: any = {
      userId: userId,
      lineBotName: `${process.env.ENVR}-helpMe`,
    };
    const params: GetItemInput = {
      TableName: 'user',
      Key: Converter.marshall(key),
    };
    const user: GetItemOutput = await this.dynamoDb.getItem(params).promise();
    if (user.Item === undefined) {
      return null;
    }

    return Converter.unmarshall(user.Item);
  }
}
