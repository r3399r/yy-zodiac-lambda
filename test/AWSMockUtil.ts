/**
 * Helpers for mocking AWS services.
 */
export class AWSMockUtil {
  public static mockRequest(responseValue: any): jest.Mock {
    return jest.fn(():any => ({
      promise: async (): Promise<any> => {
        return Promise.resolve(responseValue);
      },
    }));
  }

  public static mockRequestWhichReturnsError(responseValue: any): jest.Mock {
    return jest.fn(():any => ({
      promise: async (): Promise<any> => {
        return Promise.reject(responseValue);
      },
    }));
  }
}
