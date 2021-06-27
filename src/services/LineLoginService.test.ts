import axios from 'axios';
import { bindings } from 'src/bindings';
import { VerifyToken } from 'src/model/Line';
import { LineLoginService } from './LineLoginService';

jest.mock('axios');

/**
 * Tests of the LineLoginService class.
 */
describe('LineLoginService', () => {
  let lineLoginService: LineLoginService;
  let dummyVerifyResult: VerifyToken;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeAll(() => {
    dummyVerifyResult = {
      scope: 'profile',
      client_id: '1440057261',
      expires_in: 2591659,
    };
  });

  beforeEach(() => {
    lineLoginService = bindings.get<LineLoginService>(LineLoginService);
    mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValue({ data: dummyVerifyResult });
  });

  it('verifyToken should work', async () => {
    const res = await lineLoginService.verifyToken('abcde');
    expect(res).toStrictEqual(dummyVerifyResult);
  });

  it('verifyToken should fail when api failed', async () => {
    mockedAxios.get.mockRejectedValue({});
    await expect(lineLoginService.verifyToken('abcde')).rejects.toThrow(
      'verify token failed'
    );
  });
});
