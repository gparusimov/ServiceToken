import { Token } from "../token/token";

export enum States {
  Draft = -1,
  Created,
  Settled,
  Refunded
}

export class Task {
  public name: string;
  public token: any;
  public state: States;
  public balance: number;

  constructor(public address: string) {
    this.state = States.Draft;
  }

  get stateAsString(): string {
    return States[this.state];
  }

  inState(state: string): boolean {
    return States[this.state] === state;
  }

  isAccountType(account: string, type: string): boolean {
    if (this.token.agreement[type]) {
      return (this.token.agreement[type].toLowerCase() === account.toLowerCase());
    } else {
      return false;
    }
  }
}
