import { DynamoDB } from 'aws-sdk';
import { Container } from 'inversify';
import 'reflect-metadata';
import { UserService } from './services/UserService';

const container: Container = new Container();

container.bind<UserService>(UserService).toSelf();

// AWS
container
  .bind<DynamoDB>(DynamoDB)
  .toDynamicValue((): DynamoDB => new DynamoDB());

export { container as bindings };
