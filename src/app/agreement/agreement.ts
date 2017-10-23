export class Agreement {
  constructor(
    public tokenName: string,
    public tokenSymbol: string,
    public decimalPlaces: number,
    public totalSupply: number,
    public validFromDate: Date,
    public validFromHour: number,
    public validFromMinute: number,
    public expiresEndDate: Date,
    public expiresEndHour: number,
    public expiresEndMinute: number,
    public issuerAddress: string,
    public beneficiaryAddress: string
  ) { }
}
