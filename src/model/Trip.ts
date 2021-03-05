import { DbKey } from 'src/model/DbKey';

export interface Trip {
  type: string; // official
  status: string; // review status

  startDate: Date | string; // ISO string
  endDate: Date | string; // ISO string
  place: string;
  meetPlace: string;
  fee: number;
  thingsToBring?: string;
  participants: string[];
  needFamilyAccompany: string; // yes, no, other
  quota: number;
  shortDesc: string;
  detailedDesc: string;

  expiredDate: Date | string; // ISO string
}

export type DbTrip = Trip & DbKey;
