import { DynamoDB } from 'aws-sdk';
import {
  Converter,
  GetItemInput,
  GetItemOutput,
  PutItemInput,
  PutItemOutput,
} from 'aws-sdk/clients/dynamodb';
import { inject, injectable } from 'inversify';

/**
 * Service class for AWS dynamoDB
 */
@injectable()
export class DbService {
  @inject(DynamoDB)
  private readonly dynamoDb!: DynamoDB;
  private readonly tableName: string = `celestial-db-${process.env.ENVR}`;

  public async putItem<T>(item: T): Promise<PutItemOutput> {
    const params: PutItemInput = {
      TableName: this.tableName,
      Item: Converter.marshall(item),
    };

    return await this.dynamoDb.putItem(params).promise();
  }

  public async getItem<T1, T2>(
    key: T1,
    projectionExpression?: string
  ): Promise<T2> {
    const params: GetItemInput = {
      TableName: this.tableName,
      Key: Converter.marshall(key),
      ProjectionExpression: projectionExpression,
    };
    const res: GetItemOutput = await this.dynamoDb.getItem(params).promise();

    return <T2>(res.Item === undefined ? {} : Converter.unmarshall(res.Item));
  }
}
