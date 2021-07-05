export interface StockEvent {
  httpMethod: string;
  queryStringParameters: {
    stockId?: string;
  } | null;
}
