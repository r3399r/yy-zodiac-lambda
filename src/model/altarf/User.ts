export enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export type User = Student | Teacher;

type UserCommon = {
  lineUserId: string;
  name: string;
};

type Student = UserCommon & {
  role: Role.STUDENT;
};

type Teacher = UserCommon & {
  role: Role.TEACHER;
  studentId?: string[];
  spreadsheetId?: string;
  classroom?: string;
};
