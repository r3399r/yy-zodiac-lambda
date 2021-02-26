import { DbKey } from 'src/model/DbKey';

export enum NeedFamilyAccompany {
  YES = 'yes',
  NO = 'no',
  BOTH = 'both',
}

export interface Trip {
  id: string;
  type: string;
  status: string;

  startDate: Date | string; // ISO string
  endDate: Date | string; // ISO string
  place: string;
  meetPlace: string;
  fee: number;
  thingsToBring?: string;
  participants: string[];
  needFamilyAccompany: NeedFamilyAccompany;
  quota: number;

  shortDesc: string;
  detailedDesc: string;
}

export interface DbTrip extends DbKey {
  trips: Trip[];
}
