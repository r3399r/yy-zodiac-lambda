import { DbKey } from 'src/model/DbKey';

export interface User {
  userId: string;
  role?: string;
}

export type DbUser = User & DbKey;
