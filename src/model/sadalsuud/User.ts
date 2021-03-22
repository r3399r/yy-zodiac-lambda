import { DbKey } from 'src/model/DbKey';

export enum Role {
  STAR_RAIN = 'starRain',
  FAMILY = 'family',
  STAR = 'star',
  UNKNOWN = 'unknown',
}

export const FAKE_CREATIONID = 'fake';

export type User = StarRainUser | FamilyUser | StarUser | UnknownUser;

export interface UserCommon {
  lineUserId: string;
  name?: string;
  phone?: string;
}

type StarRainUser = UserCommon & {
  role: Role.STAR_RAIN;
  joinSession: number;
  idCard?: string;
  trips: string[];
};

type FamilyUser = UserCommon & {
  role: Role.FAMILY;
  stars?: string[]; // starCreationId
};

type StarUser = UserCommon & {
  role: Role.STAR;
  trips: string[];
  idCard?: string;
};

type UnknownUser = UserCommon & {
  role: Role.UNKNOWN;
};

export type DbUserCommon = UserCommon & DbKey;
export type DbUser = User & DbKey;
