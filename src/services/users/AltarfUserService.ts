import { inject, injectable } from 'inversify';
import { Role, Student, UpdateUserParams, User } from 'src/model/altarf/User';
import { DbKey } from 'src/model/DbKey';
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

  public async addStudents(
    lineUserId: string,
    studentId: string[]
  ): Promise<any> {
    const teacher = await this.userService.getUserByLineId(lineUserId);
    if (teacher.role !== Role.TEACHER)
      throw new Error(`role of ${lineUserId} is not teacher`);

    const students = await Promise.all(
      studentId.map(async (lineId: string) => {
        if (
          teacher.studentId !== undefined &&
          teacher.studentId.includes(lineId)
        )
          throw new Error(`student ${lineId} already exist`);

        const res = await this.userService.getUserByLineId(lineId);
        if (res.role !== Role.STUDENT)
          throw new Error(`role of ${lineId} is not student`);
        if (res.teacherId !== undefined && res.teacherId.includes(lineUserId))
          throw new Error(
            `teacher ${lineUserId} already exist in student ${lineId}`
          );

        return res;
      })
    );

    const promiseTeaher = this.userService.updateUser({
      ...teacher,
      studentId:
        teacher.studentId === undefined
          ? studentId
          : [...teacher.studentId, ...studentId],
    });
    const promiseStudent = students.map(async (student: Student & DbKey) => {
      return await this.userService.updateUser({
        ...student,
        teacherId:
          student.teacherId === undefined
            ? [teacher.lineUserId]
            : [...student.teacherId, teacher.lineUserId],
      });
    });
    await Promise.all([...promiseStudent, promiseTeaher]);
  }
}
