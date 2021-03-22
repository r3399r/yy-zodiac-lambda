import { DbKey } from 'src/model/DbKey';

export enum Role {
  STAR_RAIN = 'starRain',
  FAMILY = 'family',
  STAR = 'star',
  VOLUNTEER = 'volunteer',
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
};

type StarUser = UserCommon & {
  role: Role.STAR;
};

type VolunteerUser = UserCommon & {
  role: Role.VOLUNTEER;
};

export type DbUserCommon = UserCommon & DbKey;
export type DbUser = User & DbKey;
