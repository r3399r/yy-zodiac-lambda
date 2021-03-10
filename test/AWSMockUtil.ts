/**
 * Helpers for mocking AWS services.
 */
export class AWSMockUtil {
  public static mockRequest<T>(responseValue: T): jest.Mock {
    return jest.fn(() => ({
      promise: async () => {
        return Promise.resolve(responseValue);
      },
    }));
  }
}
