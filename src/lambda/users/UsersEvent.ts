import { Entity } from 'src/model/DbKey';

export interface UsersEvent {
  httpMethod: string;
  body: string | null;
  pathParameters: {
    entity?: Entity;
    id?: string;
  } | null;
}
