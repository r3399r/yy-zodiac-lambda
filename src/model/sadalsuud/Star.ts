import { DbKey } from 'src/model/DbKey';

export interface Star {
  name: string;
  birthday: string; // ISO string
  hasBook: boolean;
  level?: string;
  description?: string;
}

export type DbStar = Star & DbKey;
