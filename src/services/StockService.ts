import axios, { AxiosResponse } from 'axios';
import { injectable } from 'inversify';

/**
 * Service class for stock
 */
@injectable()
export class StockService {
  public async getStockInfo(stockId: string): Promise<any> {
    try {
      const url: string = 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp';
      const params = {
        ex_ch: `tse_${stockId}.tw`,
        json: '1',
        delay: '0',
      };
      const resTse: AxiosResponse = await axios.get(
        `${url}?${new URLSearchParams(params)}`
      );
      if (resTse.data.msgArray.length > 0) return resTse.data;

      params.ex_ch = `otc_${stockId}.tw`;
      const resOtc: AxiosResponse = await axios.get(
        `${url}?${new URLSearchParams(params)}`
      );

      return resOtc.data;
    } catch (e) {
      throw new Error('errer happens');
    }
  }
}
