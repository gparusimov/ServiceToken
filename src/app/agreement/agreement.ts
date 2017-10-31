export class Agreement {
  constructor(
    public address: string,
    public transaction: string,
    public state: string,
    public token: string,
    public status: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalSupply: number,
    public validFrom: string,
    public expiresEnd: string,
    public issuer: string,
    public beneficiary: string,
    public contentHash: string
  ) { }

  get validFromEpoch(): number {
    return this.toEpoch(this.validFrom);
  }

  get expiresEndEpoch(): number {
    return this.toEpoch(this.expiresEnd);
  }

  inState(state: string): boolean {
    let result: boolean;

    if (this.state) {
      let stateNumber = +this.state;

      switch(state) {
        case "Created": {
          result = stateNumber == 0;
          break;
        }
        case "Proposed": {
          result = stateNumber == 1;
          break;
        }
        case "Withdrawn": {
          result = stateNumber == 2;
          break;
        }
        case "Accepted": {
          result = stateNumber == 4;
          break;
        }
        case "Rejected": {
          result = stateNumber == 5;
          break;
        }
        default: {
          result = false;
          break;
        }
      }
    }

    return result;
  }

  private toEpoch(date: string): number {
    return Math.round(new Date(date).getTime() / 1000);
  }
}
