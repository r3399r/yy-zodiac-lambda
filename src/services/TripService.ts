import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { inject, injectable } from 'inversify';
import { DbKey, SadalsuudEntity } from 'src/model/DbKey';
import { DbTrip, Trip } from 'src/model/Trip';
import { DbService } from './DbService';

/**
 * Service class for trip
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async getTrips(): Promise<DbTrip[]> {
    return await this.dbService.query<DbTrip>({
      key: 'projectEntity',
      value: SadalsuudEntity.trip,
    });
  }

  public async getTrip(creationId: string): Promise<DbTrip> {
    return await this.dbService.getItem<DbKey, DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId,
    });
  }

  public async addTrip(trip: Trip): Promise<PutItemOutput> {
    return await this.dbService.putItem<DbTrip>({
      projectEntity: SadalsuudEntity.trip,
      creationId: Date.now().toString(16),
      ...trip,
    });
  }
}
