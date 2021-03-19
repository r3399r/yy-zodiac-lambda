import { inject, injectable } from 'inversify';
import { Entity, SadalsuudEntity } from 'src/model/DbKey';
import {
  DbUserCommon,
  FAKE_CREATIONID,
  Role,
  UserCommon,
} from 'src/model/sadalsuud/User';
import { DbUser, User } from 'src/model/User';
import { generateId } from 'src/util/generateId';
import { DbService } from './DbService';

/**
 * Service class for user
 */
@injectable()
export class UserService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async getUser(
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
      if (projectEntity === SadalsuudEntity.user)
        return {
          projectEntity,
          creationId: FAKE_CREATIONID,
          lineUserId,
          role: Role.UNKNOWN,
        };

      return null;
    }

    return userResult[0];
  }

  public async addEmptySadalsuudUser(user: UserCommon): Promise<void> {
    const creationId: string = generateId();

    await this.dbService.putItem<DbUserCommon>({
      projectEntity: SadalsuudEntity.user,
      creationId,
      ...user,
    });
  }

  public async addUser(projectEntity: Entity, user: User): Promise<void> {
    const creationId: string = generateId();

    await this.dbService.putItem<DbUser>({
      projectEntity,
      creationId,
      ...user,
    });
  }
}
