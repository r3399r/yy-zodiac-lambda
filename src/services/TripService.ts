import { inject, injectable } from 'inversify';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip, Trip } from 'src/model/sadalsuud/Trip';
import { DbUser } from 'src/model/sadalsuud/User';
import { generateId } from 'src/util/generateId';
import { Validator } from 'src/Validator';
import { DbService } from './DbService';
import { UserService } from './UserService';

/**
 * Service class for trip
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  @inject(Validator)
  private readonly validator!: Validator;

  public async getTrips(): Promise<DbTrip[]> {
    return await this.dbService.query<DbTrip>(SadalsuudEntity.trip);
  }

  public async getTrip(creationId: string): Promise<DbTrip | null> {
    const dbTrip: DbTrip | null = await this.dbService.getItem<DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId,
    });

    if (dbTrip === null) return dbTrip;

    await Promise.all(
      dbTrip.participants.map(async (participant: string, index: number) => {
        const dbUser: DbUser | null = await this.userService.getUserById(
          SadalsuudEntity.user,
          participant
        );
        if (dbUser === null)
          throw new Error(`user ${participant} is not found`);

        dbTrip.participants[index] = dbUser.name;
      })
    );

    return dbTrip;
  }

  public async addTrip(trip: Trip): Promise<DbTrip> {
    await this.validator.validateTrip(trip);

    const creationId: string = generateId();
    const dbTrip: DbTrip = {
      projectEntity: SadalsuudEntity.trip,
      creationId,
      type: trip.type,
      status: trip.status,
      startDate: trip.startDate,
      endDate: trip.endDate,
      place: trip.place,
      meetPlace: trip.meetPlace,
      dismissPlace: trip.dismissPlace,
      fee: trip.fee,
      thingsToBring: trip.thingsToBring,
      participants: trip.participants,
      needFamilyAccompany: trip.needFamilyAccompany,
      quota: trip.quota,
      shortDesc: trip.shortDesc,
      detailedDesc: trip.detailedDesc,
      expiredDate: trip.expiredDate,
    };

    await this.dbService.putItem<DbTrip>(dbTrip);

    return dbTrip;
  }
}
