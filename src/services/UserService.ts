import { inject, injectable } from 'inversify';
import { Entity } from 'src/model/DbKey';
import { DbStar } from 'src/model/sadalsuud/Star';
import { DbStarPair } from 'src/model/sadalsuud/StarPair';
import { Role, Status } from 'src/model/sadalsuud/User';
import { DbUser, User } from 'src/model/User';
import { generateId } from 'src/util/generateId';
import { Validator } from 'src/Validator';
import { DbService } from './DbService';
import { StarService } from './StarService';

/**
 * Service class for user
 */
@injectable()
export class UserService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(StarService)
  private readonly starService!: StarService;

  @inject(Validator)
  private readonly validator!: Validator;

  public async getUserById(creationId: string): Promise<DbUser | null> {
    const projectEntity: Entity = <Entity>process.env.ENTITY;

    return await this.dbService.getItem<DbUser>({
      projectEntity,
      creationId,
    });
  }

  public async getAllUsers(): Promise<DbUser[]> {
    const projectEntity: Entity = <Entity>process.env.ENTITY;

    return await this.dbService.query<DbUser>(projectEntity);
  }

  public async getUserByLineId(lineUserId: string): Promise<DbUser> {
    const projectEntity: Entity = <Entity>process.env.ENTITY;
    const userResult: DbUser[] = await this.dbService.query<DbUser>(
      projectEntity,
      [
        {
          key: 'lineUserId',
          value: lineUserId,
        },
      ]
    );

    if (userResult.length > 1)
      throw new Error('Get multiple users with same lineUserId');
    if (userResult.length === 0) {
      console.info('user not found:', lineUserId);

      throw new Error('user does not exist');
    }

    return userResult[0];
  }

  public async getWholeUserInfo(lineUserId: string): Promise<DbUser> {
    const dbUser: DbUser = await this.getUserByLineId(lineUserId);

    if (dbUser.role === Role.FAMILY || dbUser.role === Role.STAR) {
      const dbStarParis: DbStarPair[] = await this.starService.getStarPairByUser(
        dbUser.creationId
      );
      const dbStars: DbStar[] = await Promise.all(
        dbStarParis.map(async (dbStarPair: DbStarPair) => {
          return this.starService.getStar(dbStarPair.starId);
        })
      );

      return { ...dbUser, starInfo: dbStars };
    }

    return dbUser;
  }

  public async addUser(user: User): Promise<DbUser> {
    const projectEntity: Entity = <Entity>process.env.ENTITY;
    await this.validator.validateUser(projectEntity, user);

    const creationId: string = generateId();
    const dbUser: DbUser = {
      ...user,
      projectEntity,
      creationId,
      status: Status.IN_REVIEW,
    };
    await this.dbService.putItem<DbUser>(dbUser);

    return dbUser;
  }
}
