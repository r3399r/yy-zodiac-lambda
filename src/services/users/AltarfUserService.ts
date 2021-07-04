import { inject, injectable } from 'inversify';
import { Role, User } from 'src/model/altarf/User';
import { DbUser } from 'src/model/User';
import { UserService } from 'src/services/users/UserService';
import { Validator } from 'src/Validator';

/**
 * Service class for Altarf users
 */
@injectable()
export class AltarfUserService {
  @inject(UserService)
  private readonly userService!: UserService;

  @inject(Validator)
  private readonly validator!: Validator;

  public async addUser(user: User): Promise<DbUser> {
    await this.validator.validateAltarfUser(user);

    return await this.userService.addUser({
      lineUserId: user.lineUserId,
      name: user.name,
      role: Role.STUDENT,
    });
  }

  public async switchRole(lineUserId: string): Promise<DbUser> {
    const user = await this.userService.getUserByLineId(lineUserId);

    return await this.userService.updateUser({
      ...user,
      role: user.role === Role.STUDENT ? Role.TEACHER : Role.STUDENT,
    });
  }
}
