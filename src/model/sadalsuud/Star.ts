import { DbKey } from 'src/model/DbKey';

export interface Star {
  name: string;
  phone?: string;
  birthday: string;
  hasBook: boolean;
  level?: string;
  description?: string;
}

export type DbStar = Star & DbKey;

export interface FamilyMember {
  userCreationId: string;
  relation: string;
}
