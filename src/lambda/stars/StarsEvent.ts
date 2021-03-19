import { FamilyMember, Star } from 'src/model/sadalsuud/Star';

export interface StarsEvent {
  httpMethod: string;
  body: string | null;
}

export interface StarsBody {
  star: Star;
  familyMembers: FamilyMember[];
}
