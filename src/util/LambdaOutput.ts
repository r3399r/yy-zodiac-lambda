interface Output {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

// tslint:disable: export-name
export function successOutput<T>(res: T): Output {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(res),
  };
}
