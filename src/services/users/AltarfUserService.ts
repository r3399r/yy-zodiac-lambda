import { inject, injectable } from 'inversify';
import { Student } from 'src/model/altarf/User';
import { UserService } from 'src/services/users/UserService';

/**
 * Service class for Altarf users
 */
@injectable()
export class AltarfUserService {
  @inject(UserService)
  private readonly userService!: UserService;

  public async addStudent(student: Student): Promise<any> {
    return await this.userService.addUser(student);
  }
}
