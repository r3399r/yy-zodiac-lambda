import { DynamoDB } from 'aws-sdk';
import {
  AttributeMap,
  Converter,
  GetItemInput,
  GetItemOutput,
  PutItemInput,
  PutItemOutput,
  QueryInput,
  QueryOutput,
} from 'aws-sdk/clients/dynamodb';
import { inject, injectable } from 'inversify';

interface KeyValue {
  key: string;
  value: string;
}

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

  public async query<T>(
    partitionKeyVal: KeyValue,
    filterKeyVal?: KeyValue
  ): Promise<T[]> {
    const expressionAttributeValues: { [key: string]: any } = {
      ':key': partitionKeyVal.value,
    };
    if (filterKeyVal !== undefined) {
      expressionAttributeValues[':a'] = filterKeyVal.value;
    }

    const params: QueryInput = {
      TableName: this.tableName,
      ExpressionAttributeValues: Converter.marshall(expressionAttributeValues),
      KeyConditionExpression: `${partitionKeyVal.key} = :key`,
    };
    if (filterKeyVal !== undefined) {
      params.FilterExpression = `${filterKeyVal.key} = :a`;
    }

    const res: QueryOutput = await this.dynamoDb.query(params).promise();

    return <T[]>(
      (res.Items === undefined
        ? []
        : res.Items.map((item: AttributeMap): { [key: string]: any } =>
            Converter.unmarshall(item)
          ))
    );
  }
}
