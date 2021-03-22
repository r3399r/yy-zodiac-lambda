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
    return await this.dbService.query<DbTrip>(SadalsuudEntity.trip);
  }

  public async getTrip(creationId: string): Promise<DbTrip | null> {
    return await this.dbService.getItem<DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId,
    });
  }

  public async addTrip(trip: Trip): Promise<DbTrip> {
    const creationId: string = generateId();
    const dbTrip: DbTrip = {
      projectEntity: SadalsuudEntity.trip,
      creationId,
      ...trip,
    };

    await this.dbService.putItem<DbTrip>(dbTrip);

    return dbTrip;
  }
}
