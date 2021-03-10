export interface TripsEvent {
  httpMethod: string;
  body: string | null;
  pathParameters: { id: string } | null;
}
