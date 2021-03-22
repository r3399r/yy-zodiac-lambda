import { DbKey } from 'src/model/DbKey';

export interface Star {
  name: string;
  phone?: string;
  birthday: string; // ISO string
  idCard?: string;
  hasBook: boolean;
  level?: string;
  description?: string;
}

export type DbStar = Star & DbKey;
