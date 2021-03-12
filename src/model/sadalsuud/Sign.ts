import { DbKey } from 'src/model/DbKey';

export interface InputSign {
  tripCreationId: string;
  lineUserId: string;
}

export interface Sign {
  tripCreationId: string;
  userCreationId: string;
}

export type DbSign = Sign & DbKey;
