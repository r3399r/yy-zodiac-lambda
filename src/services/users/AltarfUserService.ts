import { inject, injectable } from 'inversify';
import {
  DbTeacherStudentPair,
  Role,
  UpdateUserParams,
  User,
} from 'src/model/altarf/User';
import { AltarfEntity } from 'src/model/DbKey';
import { DbUser } from 'src/model/User';
import { DbService } from 'src/services/DbService';
import { UserService } from 'src/services/users/UserService';
import { generateId } from 'src/util/generateId';
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

  @inject(DbService)
  private readonly dbService!: DbService;

  public async getUserById(lineUserId: string): Promise<DbUser> {
    return await this.userService.getUserById(lineUserId);
  }

  public async getUserByLineId(lineUserId: string): Promise<DbUser> {
    return await this.userService.getUserByLineId(lineUserId);
  }

  public async addUser(user: User): Promise<DbUser> {
    await this.validator.validateAltarfUser(user);

    return await this.userService.addUser({
      lineUserId: user.lineUserId,
      name: user.name,
      role: Role.STUDENT,
    });
  }

  public async switchRole(lineUserId: string): Promise<DbUser> {
    const user = await this.getUserByLineId(lineUserId);

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

    const dbUser = await this.getUserByLineId(lineUserId);
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

  public async addStudents(
    lineUserId: string,
    studentId: string[]
  ): Promise<void> {
    const teacher = await this.getUserByLineId(lineUserId);
    if (teacher.role !== Role.TEACHER)
      throw new Error(`role of ${lineUserId} is not teacher`);

    await Promise.all(
      studentId.map(async (id: string) => {
        const user = await this.getUserById(id);
        if (user.role !== Role.STUDENT)
          throw new Error(`role of ${id} is not student`);

        const dbTeacherStudentPair = await this.dbService.query<DbTeacherStudentPair>(
          AltarfEntity.teacherStudentPair,
          [
            { key: 'teacherId', value: teacher.creationId },
            {
              key: 'studentId',
              value: id,
            },
          ]
        );
        if (dbTeacherStudentPair.length > 0)
          throw new Error(
            `pair of teacher ${teacher.creationId} and student ${id} already exists`
          );
      })
    );

    await Promise.all(
      studentId.map(async (id: string) => {
        await this.dbService.putItem<DbTeacherStudentPair>({
          projectEntity: AltarfEntity.teacherStudentPair,
          creationId: generateId(),
          teacherId: teacher.creationId,
          studentId: id,
        });
      })
    );
  }
}
