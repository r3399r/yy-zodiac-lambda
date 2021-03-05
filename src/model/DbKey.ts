export enum SadalsuudEntity {
  trip = 'sadalsuud-trip',
  application = 'sadalsuud-application',
  target = 'sadalsuud-target',
}

export interface DbKey {
  projectEntity: SadalsuudEntity;
  creationId: string;
}
