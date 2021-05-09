import { DbKey } from 'src/model/DbKey';
import { DbStar } from './Star';

export enum Role {
  STAR_RAIN = 'starRain',
  FAMILY = 'family',
  STAR = 'star',
  VOLUNTEER = 'volunteer',
}

export enum Status {
  IN_REVIEW = 'inReview',
  PASS = 'pass',
  REJECT = 'reject',
}

export type User = StarRainUser | FamilyUser | StarUser | VolunteerUser;

export interface UserCommon {
  lineUserId: string;
  name: string;
  phone: string;
  status: string;
}

type StarRainUser = UserCommon & {
  role: Role.STAR_RAIN;
  joinSession: number;
};

type FamilyUser = UserCommon & {
  role: Role.FAMILY;
  starInfo?: DbStar[];
};

type StarUser = UserCommon & {
  role: Role.STAR;
  starInfo?: DbStar[];
};

type VolunteerUser = UserCommon & {
  role: Role.VOLUNTEER;
};

export type DbUserCommon = UserCommon & DbKey;
export type DbUser = User & DbKey;
