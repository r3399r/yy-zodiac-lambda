import { DbKey } from 'src/model/DbKey';
import { User as SadalsuudUser } from 'src/model/sadalsuud/User';

export type User = SadalsuudUser;
export type DbUser = User & DbKey;
