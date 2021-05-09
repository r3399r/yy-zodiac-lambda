import { inject, injectable } from 'inversify';
import { DbKey, Entity, SadalsuudEntity } from 'src/model/DbKey';
import { DbStar, Star } from 'src/model/sadalsuud/Star';
import { StarPair } from 'src/model/sadalsuud/StarPair';
import { DbTrip, Trip } from 'src/model/sadalsuud/Trip';
import { DbUser, Role, User as SadalsuudUser } from 'src/model/sadalsuud/User';
import { User } from 'src/model/User';
import { DbSign, Sign } from './model/sadalsuud/Sign';
import { DbService } from './services/DbService';

/**
 * Validator for lambda input
 */
@injectable()
export class Validator {
  @inject(DbService)
  private readonly dbService!: DbService;

  private async checkItemExists<T>(dbKey: DbKey): Promise<T> {
    const res: T | null = await this.dbService.getItem<T>(dbKey);
    if (res === null)
      throw new Error(
        `${dbKey.projectEntity} ${dbKey.creationId} is not found`
      );

    return res;
  }

  private async validateSadalsuudUser(user: SadalsuudUser): Promise<void> {
    if (user.lineUserId === undefined) throw new Error('lineUserId is missing');
    if (user.name === undefined) throw new Error('name is missing');
    if (user.phone === undefined) throw new Error('phone is missing');
    if (user.role === undefined) throw new Error('role is missing');
    if (user.role === Role.STAR_RAIN && user.joinSession === undefined)
      throw new Error('joinSession is missing');

    if (typeof user.lineUserId !== 'string')
      throw new Error('lineUserId should be string');
    if (typeof user.name !== 'string') throw new Error('name should be string');
    if (typeof user.phone !== 'string')
      throw new Error('phone should be string');
    if (typeof user.role !== 'string') throw new Error('role should be string');
    if (user.role === Role.STAR_RAIN && typeof user.joinSession !== 'string')
      throw new Error('joinSession should be string');

    const dbUser: DbUser[] = await this.dbService.query<DbUser>(
      SadalsuudEntity.user,
      [
        {
          key: 'lineUserId',
          value: user.lineUserId,
        },
      ]
    );
    if (dbUser.length !== 0) throw new Error('user already exists');
  }

  public async validateUser(projectEntity: Entity, user: User): Promise<void> {
    if (projectEntity === SadalsuudEntity.user)
      await this.validateSadalsuudUser(user);
  }

  public async validateSign(sign: Sign): Promise<void> {
    if (sign.tripId === undefined) throw new Error('tripId is missing');
    if (sign.starId === undefined) throw new Error('starId is missing');

    if (typeof sign.tripId !== 'string')
      throw new Error('tripId should be string');
    if (typeof sign.starId !== 'string')
      throw new Error('starId should be string');

    await this.checkItemExists<DbStar>({
      projectEntity: SadalsuudEntity.star,
      creationId: sign.starId,
    });
    await this.checkItemExists<DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId: sign.tripId,
    });

    const dbSign: DbSign[] = await this.dbService.query<DbSign>(
      SadalsuudEntity.sign,
      [
        {
          key: 'starId',
          value: sign.starId,
        },
        {
          key: 'tripId',
          value: sign.tripId,
        },
      ]
    );
    if (dbSign.length !== 0) throw new Error('already signed');
  }

  public validateStar(star: Star): void {
    if (star.name === undefined) throw new Error('name is missing');
    if (star.birthday === undefined) throw new Error('birthday is missing');
    if (star.hasBook === undefined) throw new Error('hasBook is missing');
    if (star.hasBook === true && star.level === undefined)
      throw new Error('level is missing');

    if (typeof star.name !== 'string') throw new Error('name should be string');
    if (typeof star.birthday !== 'string')
      throw new Error('birthday should be string');
    if (typeof star.hasBook !== 'boolean')
      throw new Error('hasBook should be boolean');
    if (star.hasBook === true && typeof star.level !== 'string')
      throw new Error('level should be string');
  }

  public async validateStarPair(starPair: StarPair): Promise<void> {
    if (starPair.starId === undefined) throw new Error('starId is missing');
    if (starPair.userId === undefined) throw new Error('userId is missing');
    if (starPair.relationship === undefined)
      throw new Error('relationship is missing');

    if (typeof starPair.starId !== 'string')
      throw new Error('starId should be string');
    if (typeof starPair.userId !== 'string')
      throw new Error('userId should be string');
    if (typeof starPair.relationship !== 'string')
      throw new Error('relationship should be string');

    await this.checkItemExists<DbStar>({
      projectEntity: SadalsuudEntity.star,
      creationId: starPair.starId,
    });
    const user: DbUser = await this.checkItemExists<DbUser>({
      projectEntity: SadalsuudEntity.user,
      creationId: starPair.userId,
    });
    if (user.role !== Role.FAMILY && user.role !== Role.STAR)
      throw new Error(
        `role of user ${starPair.userId} is not ${Role.FAMILY} or ${Role.STAR}`
      );
  }

  public async validateTrip(trip: Trip): Promise<void> {
    if (trip.type === undefined) throw new Error('type is missing');
    if (trip.status === undefined) throw new Error('status is missing');
    if (trip.startDate === undefined) throw new Error('startDate is missing');
    if (trip.endDate === undefined) throw new Error('endDate is missing');
    if (trip.place === undefined) throw new Error('place is missing');
    if (trip.meetPlace === undefined) throw new Error('meetPlace is missing');
    if (trip.dismissPlace === undefined)
      throw new Error('dismissPlace is missing');
    if (trip.fee === undefined) throw new Error('fee is missing');
    if (trip.participants === undefined)
      throw new Error('participants is missing');
    if (trip.needFamilyAccompany === undefined)
      throw new Error('needFamilyAccompany is missing');
    if (trip.quota === undefined) throw new Error('quota is missing');
    if (trip.shortDesc === undefined) throw new Error('shortDesc is missing');
    if (trip.detailedDesc === undefined)
      throw new Error('detailedDesc is missing');
    if (trip.expiredDate === undefined)
      throw new Error('expiredDate is missing');

    if (typeof trip.type !== 'string') throw new Error('type should be string');
    if (typeof trip.status !== 'string')
      throw new Error('status should be string');
    if (typeof trip.startDate !== 'string')
      throw new Error('startDate should be string');
    if (typeof trip.endDate !== 'string')
      throw new Error('endDate should be string');
    if (typeof trip.place !== 'string')
      throw new Error('place should be string');
    if (typeof trip.meetPlace !== 'string')
      throw new Error('meetPlace should be string');
    if (typeof trip.dismissPlace !== 'string')
      throw new Error('dismissPlace should be string');
    if (typeof trip.fee !== 'string') throw new Error('fee should be string');
    if (
      trip.thingsToBring !== undefined &&
      typeof trip.thingsToBring !== 'string'
    )
      throw new Error('thingsToBring should be string');
    if (typeof trip.needFamilyAccompany !== 'string')
      throw new Error('needFamilyAccompany should be string');
    if (typeof trip.quota !== 'number')
      throw new Error('quota should be number');
    if (typeof trip.shortDesc !== 'string')
      throw new Error('shortDesc should be string');
    if (typeof trip.detailedDesc !== 'string')
      throw new Error('detailedDesc should be string');
    if (typeof trip.expiredDate !== 'string')
      throw new Error('expiredDate should be string');

    if (trip.quota <= 0) throw new Error('quota should be greater than 0');

    if (!Array.isArray(trip.participants))
      throw new Error('participants should be an array');

    for (const participant of trip.participants) {
      if (typeof participant !== 'string')
        throw new Error('participants should be an array of string');

      const user: DbUser = await this.checkItemExists<DbUser>({
        projectEntity: SadalsuudEntity.user,
        creationId: participant,
      });
      if (user.role !== Role.STAR_RAIN)
        throw new Error(`role of user ${participant} is not ${Role.STAR_RAIN}`);
    }
  }
}
