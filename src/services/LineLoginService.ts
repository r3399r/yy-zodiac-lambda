import axios, { AxiosResponse } from 'axios';
import { injectable } from 'inversify';
import { VerifyToken } from 'src/model/Line';

/**
 * Service class for line login related api
 */
@injectable()
export class LineLoginService {
  public async verifyToken(lineAccessToken: string): Promise<VerifyToken> {
    try {
      const url: string = 'https://api.line.me/oauth2/v2.1/verify';
      const params = {
        access_token: lineAccessToken,
      };
      const res: AxiosResponse<VerifyToken> = await axios.get(
        `${url}?${new URLSearchParams(params)}`
      );

      return res.data;
    } catch (e) {
      throw new Error('verify token failed');
    }
  }
}
