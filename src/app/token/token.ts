import { Agreement } from "../agreement/agreement";

export class Token {

  constructor(
    public address: string,
    public agreement: Agreement,
    public tasks: string[],
    public balances: Map<string, number>
  ) {}
}
