import { inject, injectable } from 'inversify';
import { LineEntity, SadalsuudEntity } from 'src/model/DbKey';
import { DbSign, InputSign } from 'src/model/Sign';
import { DbUser, Role } from 'src/model/User';
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
    const userResult: DbUser[] = await this.dbService.query<DbUser>(
      LineEntity.user,
      [
        {
          key: 'lineUserId',
          value: sign.lineUserId,
        },
      ]
    );
    console.log(userResult);
    if (userResult.length > 1) {
      throw new Error('Get multiple users with same lineUserId');
    }

    // if user does not exist, add user
    if (userResult.length === 0) {
      await this.userService.addEmptyUser({ lineUserId: sign.lineUserId });
    }

    // if user does not exist or role does not exist in user, return
    if (userResult.length === 0 || userResult[0].role === undefined) {
      await this.lineService.pushMessage(sign.lineUserId, '測試測試');

      return '注意LINE';
    }

    const user: DbUser = userResult[0];

    // if role is STAR_RAIN, return
    if (user.role === Role.STAR_RAIN) {
      return '哈囉星雨的哥姐，此報名僅開放給星兒或家長。若你想主揪星遊或你並不是星雨的成員，請洽LINE官方帳號，謝謝';
    }

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
    if (existentSign.length > 1) {
      throw new Error(
        'Get multiple signs with same tripCreationId and userCreationId'
      );
    }

    // if sign exists, return
    if (existentSign.length === 1) {
      return '已經報名過囉';
    }

    // add trip-user-pair into sign db
    const creationId: string = generateId();
    await this.dbService.putItem<DbSign>({
      projectEntity: SadalsuudEntity.sign,
      creationId,
      tripCreationId: sign.tripCreationId,
      userCreationId: user.creationId,
    });

    return '報名成功';
  }
}
