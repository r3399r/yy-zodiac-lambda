export interface UsersEvent {
  httpMethod: string;
  body: string | null;
  queryStringParameters: { userId: string };
}
