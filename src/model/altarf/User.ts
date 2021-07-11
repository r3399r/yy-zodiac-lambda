import { DbKey } from 'src/model/DbKey';

export enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export type User = Student | Teacher;

type UserCommon = {
  lineUserId: string;
  name: string;
};

export type Student = UserCommon & {
  role: Role.STUDENT;
};

type Teacher = UserCommon & {
  role: Role.TEACHER;
  spreadsheetId?: string;
  classroom?: string;
};

export type UpdateUserParams = {
  name?: string;
  spreadsheetId?: string;
  classroom?: string;
};

type TeacherStudentPair = {
  teacherId: string;
  studentId: string;
  quizId?: string[];
};

export type DbTeacherStudentPair = DbKey & TeacherStudentPair;
