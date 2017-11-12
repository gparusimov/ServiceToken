export enum States {
  Error = -5,
  Failed,
  Submitted,
  Signing,
  Draft,
  Created,
  Proposed,
  Withdrawn,
  Accepted,
  Rejected
}

export class Agreement {
  public transaction: string;
  public state: States;
  public token: string;
  public name: string;
  public symbol: string;
  public decimals: number;
  public totalSupply: number;
  public validFrom: number;
  public expiresEnd: number;
  public issuer: string;
  public beneficiary: string;
  public contentHash: string;
  public price: number;

  constructor(public address: string) {
    this.state = States.Draft;
    this.validFrom = this.dateToEpoch(new Date());
    this.expiresEnd = this.dateToEpoch(new Date());
  }

  get validFromAsISOString(): string {
    return this.epochToDate(this.validFrom);
  }

  set validFromAsISOString(date: string) {
    this.validFrom = this.stringToEpoch(date);
  }

  get expiresEndAsISOString(): string {
    return this.epochToDate(this.expiresEnd);
  }

  set expiresEndAsISOString(date: string) {
    this.expiresEnd = this.stringToEpoch(date);
  }

  get stateAsString(): string {
    return States[this.state];
  }

  inState(state: string): boolean {
    return States[this.state] === state;
  }

  isAccountType(account: string, type: string): boolean {
    if (this[type]) {
      return (this[type].toLowerCase() === account.toLowerCase());
    } else {
      return false;
    }
  }

  private stringToEpoch(date: string): number {
    return this.dateToEpoch(new Date(date));
  }

  private dateToEpoch(date: Date): number {
    return (date.getTime()) / 1000;
  }

  private epochToDate(date: number): string {
    return new Date(+date * 1000).toISOString().slice(0, -1);
  }
}
