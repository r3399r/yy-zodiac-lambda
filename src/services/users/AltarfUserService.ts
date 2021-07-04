import { inject, injectable } from 'inversify';
import { Role, UpdateUserParams, User } from 'src/model/altarf/User';
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

  public async updateUser(
    lineUserId: string,
    params: UpdateUserParams
  ): Promise<DbUser> {
    this.validator.validateUpdateUserParams(params);

    const dbUser = await this.userService.getUserByLineId(lineUserId);
    if (dbUser.role === Role.STUDENT) {
      if (params.classroom !== undefined)
        throw new Error('role student should not have classroom attribute');
      if (params.spreadsheetId !== undefined)
        throw new Error('role student should not have spreadsheetId attribute');

      return await this.userService.updateUser({
        ...dbUser,
        name: params.name !== undefined ? params.name : dbUser.name,
      });
    } else if (dbUser.role === Role.TEACHER)
      return await this.userService.updateUser({
        ...dbUser,
        name: params.name !== undefined ? params.name : dbUser.name,
        classroom:
          params.classroom !== undefined ? params.classroom : dbUser.classroom,
        spreadsheetId:
          params.spreadsheetId !== undefined
            ? params.spreadsheetId
            : dbUser.spreadsheetId,
      });
    else throw new Error('unexpected role');
  }
}
