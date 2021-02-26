import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { inject, injectable } from 'inversify';
import { DbKey, Project } from 'src/model/DbKey';
import { DbTrip, Trip } from 'src/model/Trip';
import { DbService } from './DbService';

/**
 * Service class for trip
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async getTrips(): Promise<Trip[]> {
    const res: DbTrip = await this.dbService.getItem<DbKey, DbTrip>(
      { userId: 'system', project: Project.SADALSUUD },
      'trips'
    );

    return res.trips === undefined ? [] : res.trips;
  }

  public async getTrip(id: string): Promise<Trip | null> {
    const trips: Trip[] = await this.getTrips();
    let target: Trip | null = null;
    trips.forEach((trip: Trip): void => {
      if (id === trip.id) {
        target = trip;
      }
    });

    return target;
  }

  public async addTrip(trip: Trip): Promise<PutItemOutput> {
    const existentTrips: Trip[] = await this.getTrips();

    existentTrips.push(trip);

    return await this.dbService.putItem<DbTrip>({
      userId: 'system',
      project: Project.SADALSUUD,
      trips: existentTrips,
    });
  }
}
