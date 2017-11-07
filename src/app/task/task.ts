import { default as CryptoJS } from 'crypto-js';

export enum States {
  Draft = -1,
  Created,
  Settled,
  Refunded
}

export class Task {
  public name: string;
  public token: string;
  public issuer: string;
  public beneficiary: string;
  public state: States;
  public balance: number;

  constructor(public address: string) {
    this.state = States.Draft;
  }

  get plainName(): string {
    return this.name;
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
}
