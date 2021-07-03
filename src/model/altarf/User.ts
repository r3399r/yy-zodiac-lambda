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
  enrollmentYear: number;
  role: Role.STUDENT;
};

type Teacher = UserCommon & {
  role: Role.TEACHER;
};
