import { inject, injectable } from 'inversify';
import { SadalsuudEntity } from 'src/model/DbKey';
import { Trip } from 'src/model/sadalsuud/Trip';
import { DbUser, Role } from 'src/model/sadalsuud/User';
import { UserService } from 'src/services/UserService';

/**
 * Validator of trip type
 */
@injectable()
export class TripValidator {
  @inject(UserService)
  private readonly userService!: UserService;

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

      const user: DbUser | null = await this.userService.getUserById(
        SadalsuudEntity.user,
        participant
      );
      if (user === null) throw new Error(`user ${participant} is not found`);
      if (user.role !== Role.STAR_RAIN)
        throw new Error(`role of user ${participant} is not ${Role.STAR_RAIN}`);
    }
  }
}
