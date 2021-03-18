import { inject, injectable } from 'inversify';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbSign, InputSign } from 'src/model/sadalsuud/Sign';
import { DbUser, Role } from 'src/model/sadalsuud/User';
import { generateId } from 'src/util/generateId';
import { DbService } from './DbService';
import { LineService } from './LineService';
import { UserService } from './UserService';

/**
 * Service class for trip signing up
 */
@injectable()
export class SignService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  @inject(LineService)
  private readonly lineService!: LineService;

  public async addSign(sign: InputSign): Promise<string> {
    // find linsUserId in line-user of db
    const user: DbUser | null = await this.userService.getUser(
      SadalsuudEntity.user,
      sign.lineUserId
    );

    // if user does not exist, add user
    if (user === null)
      await this.userService.addEmptySadalsuudUser({
        lineUserId: sign.lineUserId,
      });

    // if user does not exist or role does not exist in user, return
    if (user === null || user.role === undefined) {
      await this.lineService.pushMessage(sign.lineUserId, [
        '您好，我們收到您的報名申請，但由於我們的資料庫中並未有您的資料，故報名尚未成功。',
        '為了讓活動順利進行，我們會先詢問一些基本資訊，請您提供方便回覆訊息的時間，讓我們能夠聯繫您',
      ]);

      return '報名尚未成功。資料庫並未有您的資料，請開啟LINE回覆星遊的官方帳號';
    }

    // if role is STAR_RAIN, return
    if (user.role === Role.STAR_RAIN)
      return '報名失敗。此活動僅開放給星兒或家長報名，資料庫顯示您的身份為「星雨哥姐」。若您想參加活動或資料設定有誤，請洽星遊的LINE官方帳號，謝謝';

    // find trip-user pair
    const existentSign: DbSign[] = await this.dbService.query<DbSign>(
      SadalsuudEntity.sign,
      [
        {
          key: 'tripCreationId',
          value: sign.tripCreationId,
        },
        { key: 'userCreationId', value: user.creationId },
      ]
    );
    if (existentSign.length > 1)
      throw new Error(
        'Get multiple signs with same tripCreationId and userCreationId'
      );

    // if sign exists, return
    if (existentSign.length === 1)
      return '已經報名成功過囉，將於截止後進行抽籤';

    // add trip-user-pair into sign db
    const creationId: string = generateId();
    await this.dbService.putItem<DbSign>({
      projectEntity: SadalsuudEntity.sign,
      creationId,
      tripCreationId: sign.tripCreationId,
      userCreationId: user.creationId,
    });

    return '報名成功，將於截止後進行抽籤';
  }
}
