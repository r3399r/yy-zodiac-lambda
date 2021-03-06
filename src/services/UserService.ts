import { inject, injectable } from 'inversify';
import { LineEntity } from 'src/model/DbKey';
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

  public async getUser(creationId: string): Promise<DbUser> {
    return await this.dbService.getItem<DbUser>({
      projectEntity: LineEntity.user,
      creationId,
    });
  }

  public async addUser(user: User): Promise<void> {
    const creationId: string = generateId();

    await this.dbService.putItem<DbUser>({
      projectEntity: LineEntity.user,
      creationId,
      ...user,
    });
  }
}
