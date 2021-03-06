export interface PushMessage {
  to: string;
  messages: string[];
}

export interface VerifyToken {
  scope: string;
  client_id: string;
  expires_in: number;
}
