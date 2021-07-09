export interface QuizValidateEvent {
  httpMethod: string;
  pathParameters: {
    id?: string;
  } | null;
  headers: {
    'x-api-line'?: string;
  };
}
