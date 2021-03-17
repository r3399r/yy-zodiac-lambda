import { inject, injectable } from 'inversify';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip, Trip } from 'src/model/sadalsuud/Trip';
import { generateId } from 'src/util/generateId';
import { DbService } from './DbService';

/**
 * Service class for trip
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async getTrips(): Promise<DbTrip[]> {
    const trips: DbTrip[] = await this.dbService.query<DbTrip>(
      SadalsuudEntity.trip
    );
    const res: DbTrip[] = [];
    trips.forEach((trip: DbTrip) => {
      if (new Date(trip.expiredDate).getTime() > Date.now()) res.push(trip);
    });

    return res;
  }

  public async getTrip(creationId: string): Promise<DbTrip> {
    return await this.dbService.getItem<DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId,
    });
  }

  public async addTrip(trip: Trip): Promise<void> {
    const creationId: string = generateId();

    // add trips to user

    await this.dbService.putItem<DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId,
      ...trip,
    });
  }
}
