import { DynamoDB } from 'aws-sdk';
import { Container } from 'inversify';
import 'reflect-metadata';
import { DbService } from 'src/services/DbService';
import { TripService } from 'src/services/TripService';
import { UserService } from 'src/services/UserService';

const container: Container = new Container();

container.bind<DbService>(DbService).toSelf();
container.bind<TripService>(TripService).toSelf();
container.bind<UserService>(UserService).toSelf();

// AWS
container
  .bind<DynamoDB>(DynamoDB)
  .toDynamicValue((): DynamoDB => new DynamoDB());

export { container as bindings };
