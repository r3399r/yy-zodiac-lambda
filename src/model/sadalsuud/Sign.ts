import { DbKey } from 'src/model/DbKey';

export interface InputSign {
  tripId: string;
  lineUserId: string;
}

export interface Sign {
  tripId: string;
  userId: string;
}

export type DbSign = Sign & DbKey;
