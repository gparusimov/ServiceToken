export class Agreement {

  constructor(
    public address: string,
    public transaction: string,
    public state: string,
    public token: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalSupply: number,
    public validFrom: number,
    public expiresEnd: number,
    public issuer: string,
    public beneficiary: string,
    public contentHash: string
  ) { }


  get validFromISOString(): string {
    return new Date(+this.validFrom * 1000).toISOString().slice(0, -1);
  }

  set validFromISOString(date: string) {
    this.validFrom = (new Date(date).getTime()) / 1000;
  }

  get expiresEndISOString(): string {
    return new Date(+this.expiresEnd * 1000).toISOString().slice(0, -1);
  }

  set expiresEndISOString(date: string) {
    this.expiresEnd = (new Date(date).getTime()) / 1000;
  }

  get stateString(): string {
    let state: string;

    if (this.state) {
      switch(+this.state) {
        case -5: {
          state = "Error";
          break;
        }
        case -4: {
          state = "Failed";
          break;
        }
        case -3: {
          state = "Submitted";
          break;
        }
        case -2: {
          state = "Signing";
          break;
        }
        case -1: {
          state = "Draft";
          break;
        }
        case 0: {
          state = "Created";
          break;
        }
        case 1: {
          state = "Proposed";
          break;
        }
        case 2: {
          state = "Withdrawn";
          break;
        }
        case 3: {
          state = "Accepted";
          break;
        }
        case 4: {
          state = "Rejected";
          break;
        }
        default: {
          state = "Unknown";
          break;
        }
      }
    }

    return state;
  }

  set stateString(state: string) {
    switch(state) {
      case "Error": {
        this.state = "-5";
        break;
      }
      case "Failed": {
        this.state = "-4";
        break;
      }
      case "Submitted": {
        this.state = "-3";
        break;
      }
      case "Signing": {
        this.state = "-2";
        break;
      }
      case "Draft": {
        this.state = "-1";
        break;
      }
      case "Created": {
        this.state = "0";
        break;
      }
      case "Proposed": {
        this.state = "1";
        break;
      }
      case "Withdrawn": {
        this.state = "2";
        break;
      }
      case "Accepted": {
        this.state = "3";
        break;
      }
      case "Rejected": {
        this.state = "4";
        break;
      }
      default: {
        this.state = "0";
        break;
      }
    }
  }

  inState(state: string): boolean {
    let result: boolean;

    if (this.state) {
      let stateNumber = +this.state;

      switch(state) {
        case "Error": {
          result = stateNumber == -5;
          break;
        }
        case "Failed": {
          result = stateNumber == -4;
          break;
        }
        case "Submitted": {
          result = stateNumber == -3;
          break;
        }
        case "Signing": {
          result = stateNumber == -2;
          break;
        }
        case "Draft": {
          result = stateNumber == -1;
          break;
        }
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
          result = stateNumber == 3;
          break;
        }
        case "Rejected": {
          result = stateNumber == 4;
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
}
