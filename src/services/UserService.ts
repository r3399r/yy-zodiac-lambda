import { inject, injectable } from 'inversify';
import { Entity } from 'src/model/DbKey';
import { DbUser, User } from 'src/model/User';
import { generateId } from 'src/util/generateId';
import { Validator } from 'src/Validator';
import { DbService } from './DbService';

/**
 * Service class for user
 */
@injectable()
export class UserService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(Validator)
  private readonly validator!: Validator;

  public async getUserById(
    projectEntity: Entity,
    creationId: string
  ): Promise<DbUser | null> {
    return await this.dbService.getItem<DbUser>({
      projectEntity,
      creationId,
    });
  }

  public async getUserByLineId(
    projectEntity: Entity,
    lineUserId: string
  ): Promise<DbUser | null> {
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

      return null;
    }

    return userResult[0];
  }

  public async addUser(projectEntity: Entity, user: User): Promise<DbUser> {
    await this.validator.validateUser(projectEntity, user);

    const creationId: string = generateId();
    const dbUser: DbUser = {
      projectEntity,
      creationId,
      ...user,
    };
    await this.dbService.putItem<DbUser>(dbUser);

    return dbUser;
  }
}
