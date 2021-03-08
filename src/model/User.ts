import { DbKey } from 'src/model/DbKey';

export enum Role {
  STAR_RAIN = 'starRain',
  FAMILY = 'family',
  STAR = 'star',
}

export type User = StarRainUser | FamilyUser | StarUser;

export interface UserCommon {
  lineUserId: string;
  name?: string;
  birthday?: string;
}

export type StarRainUser = UserCommon & {
  role: Role.STAR_RAIN;
  joinSession: number;
  phone: string;
  trips: string[];
};

export type FamilyUser = UserCommon & {
  role: Role.FAMILY;
  phone: string;
  stars: string[];
};

export type StarUser = UserCommon & {
  role: Role.STAR;
  phone?: string;
  trips: string[];
};

export type DbUserCommon = UserCommon & DbKey;
export type DbUser = User & DbKey;
