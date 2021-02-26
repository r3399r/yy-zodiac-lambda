export interface TripsEvent {
  httpMethod: string;
  body: string;
  pathParameters: { id: string };
}
