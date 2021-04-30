export interface UsersEvent {
  httpMethod: string;
  body: string | null;
  pathParameters: {
    id?: string;
  } | null;
}
