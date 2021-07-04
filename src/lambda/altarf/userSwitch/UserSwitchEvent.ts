export interface UserSwitchEvent {
  httpMethod: string;
  body: string | null;
  pathParameters: {
    id?: string;
  } | null;
}
