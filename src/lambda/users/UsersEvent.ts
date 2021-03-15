import { Entity } from 'src/model/DbKey';

export interface UsersEvent {
  httpMethod: string;
  body: string | null;
  pathParameters: {
    id?: string;
  } | null;
  queryStringParameters: {
    entity?: Entity;
  } | null;
}
