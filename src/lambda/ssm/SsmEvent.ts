import { Entity } from 'src/model/DbKey';

export interface SsmEvent {
  httpMethod: string;
  body: string | null;
  queryStringParameters: {
    name?: Entity;
  } | null;
}
