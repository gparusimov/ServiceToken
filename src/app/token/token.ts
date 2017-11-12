import { Agreement } from "../agreement/agreement";

export class Token {
  public agreement: any;
  public taskArray: string[];
  public balances: Map<string, number>;

  constructor(public address: string) {
    this.balances = new Map<string, number>();
  }
}
