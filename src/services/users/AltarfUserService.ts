import { inject, injectable } from 'inversify';
import { Role, User } from 'src/model/altarf/User';
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

  public async addUser(user: User): Promise<any> {
    await this.validator.validateAltarfUser(user);
    if (user.role === Role.STUDENT)
      return await this.userService.addUser({
        lineUserId: user.lineUserId,
        name: user.name,
        role: user.role,
        enrollmentYear: user.enrollmentYear,
      });
    else
      return await this.userService.addUser({
        lineUserId: user.lineUserId,
        name: user.name,
        role: user.role,
      });
  }
}
