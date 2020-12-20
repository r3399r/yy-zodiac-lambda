import { Container } from 'inversify';
import 'reflect-metadata';
import { LambdaAService } from './services/LambdaAService';

const container: Container = new Container();

container.bind<LambdaAService>(LambdaAService).toSelf();

export { container as bindings };
