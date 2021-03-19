import { DbKey } from 'src/model/DbKey';

export enum NeedFamilyAccompany {
  YES = 'yes',
  OPTIONAL = 'optional',
}

export interface Trip {
  type: string; // official
  status: string; // review status

  startDate: string; // ISO string
  endDate: string; // ISO string
  place: string;
  meetPlace: string;
  dismissPlace: string;

  fee: string;
  thingsToBring?: string;
  participants: string[];
  needFamilyAccompany: NeedFamilyAccompany;
  quota: number;
  shortDesc: string;
  detailedDesc: string;

  expiredDate: string; // ISO string
}

export type DbTrip = Trip & DbKey;
