export interface SsmEvent {
  httpMethod: string;
  queryStringParameters: {
    name?: string;
  } | null;
}
