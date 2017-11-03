export enum States {
  Created,
  Settled,
  Refunded
}

export class Task {
  constructor(
    public address: string,
    public token: string,
    public issuer: string,
    public beneficiary: string,
    public state: States,
    public balance: number
  ) {}
}
