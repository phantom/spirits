export interface SweepstakesObj {
  id: string;
  name: string;
  image: string;
  expiration: string;
  numLeftInCollection: number;
}

export interface SweepstakesDatabaseObj {
  id: string;
  pubkey: string;
  sweepstakes: string;
}
