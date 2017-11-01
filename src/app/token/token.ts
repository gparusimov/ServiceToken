export class Token {
  constructor(
    public address: string,
    public agreement: string,
    public tasks: string[],
    public balance: number
  ) { }
}
