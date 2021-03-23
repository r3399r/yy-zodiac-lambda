import { DbKey } from 'src/model/DbKey';

export interface StarPair {
  starId: string;
  userId: string;
  relationship: string;
}

export type DbStarPair = StarPair & DbKey;
