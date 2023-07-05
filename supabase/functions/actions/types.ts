export interface ActionsRequest {
  session_id: string;
  pubkey: string;
  type: string;
  payload: any;
}

export interface ActionsDatabase {
  session_id: string;
  pubkey: string;
  type: string;
  payload: any;
  createdAt: string;
}
