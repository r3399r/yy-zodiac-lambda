import { Client } from '@line/bot-sdk';
import { DynamoDB } from 'aws-sdk';
import { Container } from 'inversify';
import 'reflect-metadata';
import { DbService } from 'src/services/DbService';
import { LineService } from 'src/services/LineService';
import { SignService } from 'src/services/SignService';
import { TripService } from 'src/services/TripService';
import { UserService } from 'src/services/UserService';

const container: Container = new Container();

container.bind<DbService>(DbService).toSelf();
container.bind<LineService>(LineService).toSelf();
container.bind<SignService>(SignService).toSelf();
container.bind<TripService>(TripService).toSelf();
container.bind<UserService>(UserService).toSelf();

container.bind<Client>(Client).toDynamicValue(
  (): Client =>
    new Client({
      channelAccessToken: String(process.env.CHANNEL_TOKEN),
      channelSecret: String(process.env.CHANNEL_SECRET),
    })
);

// AWS
container
  .bind<DynamoDB>(DynamoDB)
  .toDynamicValue((): DynamoDB => new DynamoDB());

export { container as bindings };
