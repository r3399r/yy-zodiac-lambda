import { inject, injectable } from 'inversify';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbStar, Star } from 'src/model/sadalsuud/Star';
import { generateId } from 'src/util/generateId';
import { DbService } from './DbService';

/**
 * Service class for stars
 */
@injectable()
export class StarService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async addStar(star: Star): Promise<DbStar> {
    const creationId: string = generateId();
    const dbStar: DbStar = {
      projectEntity: SadalsuudEntity.star,
      creationId,
      ...star,
    };

    await this.dbService.putItem<DbStar>(dbStar);

    return dbStar;
  }
}
