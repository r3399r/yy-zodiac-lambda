export type Entity = SadalsuudEntity | LineEntity;

export enum SadalsuudEntity {
  trip = 'sadalsuud-trip',
  sign = 'sadalsuud-sign',
  target = 'sadalsuud-target',
}

export enum LineEntity {
  user = 'line-user',
}

export interface DbKey {
  projectEntity: Entity;
  creationId: string;
}
