import { inject, injectable } from 'inversify';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbStar, FamilyMember, Star } from 'src/model/sadalsuud/Star';
import { DbUser, Role } from 'src/model/sadalsuud/User';
import { generateId } from 'src/util/generateId';
import { DbService } from './DbService';

/**
 * Service class for stars
 */
@injectable()
export class StarService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async addStar(
    star: Star,
    familyMembers: FamilyMember[]
  ): Promise<void> {
    try {
      const familyMember: DbUser = await this.dbService.getItem<DbUser>({
        projectEntity: SadalsuudEntity.user,
        creationId: familyMembers[0].userCreationId,
      });
      console.log(familyMember);

      if (familyMember.role !== Role.FAMILY)
        throw new Error('the user role should be family');

      const creationId: string = generateId();

      await this.dbService.putItem<DbStar>({
        projectEntity: SadalsuudEntity.star,
        creationId,
        ...star,
      });

      if (familyMember.stars === undefined) familyMember.stars = [creationId];
      else familyMember.stars.push(creationId);

      await this.dbService.putItem<DbUser>(familyMember);
    } catch (e) {
      throw new Error(e);
    }
  }
}
