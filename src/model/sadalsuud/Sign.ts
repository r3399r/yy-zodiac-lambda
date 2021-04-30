import { DbKey } from 'src/model/DbKey';

export interface Sign {
  tripId: string;
  starId: string;
}

export type DbSign = Sign & DbKey;
