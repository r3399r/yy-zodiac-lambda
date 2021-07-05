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
  teacherId?: string[];
};

type Teacher = UserCommon & {
  role: Role.TEACHER;
  studentId?: string[];
  spreadsheetId?: string;
  classroom?: string;
};

export type UpdateUserParams = {
  name?: string;
  spreadsheetId?: string;
  classroom?: string;
};
