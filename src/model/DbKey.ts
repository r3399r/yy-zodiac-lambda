export type Entity = SadalsuudEntity;

export enum SadalsuudEntity {
  trip = 'sadalsuud-trip',
  sign = 'sadalsuud-sign',
  target = 'sadalsuud-target',
  user = 'sadalsuud-user',
  star = 'sadalsuud-star',
  starPair = 'sadalsuud-starPair',
}

export interface DbKey {
  projectEntity: Entity;
  creationId: string;
}
