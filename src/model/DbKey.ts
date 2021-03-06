export enum SadalsuudEntity {
  trip = 'sadalsuud-trip',
  application = 'sadalsuud-application',
  target = 'sadalsuud-target',
}

export enum LineEntity {
  user = 'line-user',
}

export interface DbKey {
  projectEntity: SadalsuudEntity | LineEntity;
  creationId: string;
}
