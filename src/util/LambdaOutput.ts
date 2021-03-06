export interface LambdaOutput {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

export function successOutput<T>(res: T): LambdaOutput {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(res),
  };
}

export function errorOutput(error: Error): LambdaOutput {
  return {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      code: 400,
      message: error.message,
    }),
  };
}
