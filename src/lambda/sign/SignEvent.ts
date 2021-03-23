export interface SignEvent {
  httpMethod: string;
  body: string | null;
  queryStringParameters: {
    tripId?: string;
  } | null;
}
