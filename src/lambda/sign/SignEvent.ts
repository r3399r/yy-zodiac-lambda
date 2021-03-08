export interface SignEvent {
  httpMethod: string;
  body: string | null;
  pathParameters: { id: string };
}
