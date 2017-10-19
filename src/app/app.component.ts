import { Component, OnInit } from '@angular/core';
import { Web3Service } from "./web3/web3.service";
import { MatSnackBar } from '@angular/material';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  accounts : string[];
  account: string;
  Factory : Promise<any>;
  agreement: Agreement;

  constructor(private web3Service : Web3Service, public snackBar: MatSnackBar) {
    console.log("AccountComponent constructor: " + web3Service);
  }

  ngOnInit() {
    this.watchAccount();

    this.newAgreement();

    this.Factory = new Promise((resolve, reject) => {
      setInterval(() => {
        if (this.web3Service.ready) {
          resolve(this.web3Service.FlexiTimeFactory);
        }
      }, 100)
    });
  }

  onSubmit() {
    console.log("submitting");

    this.Factory.then((contract) => {
      return contract.deployed();
    }).then((factoryInstance) => {
      return factoryInstance.createAgreement.sendTransaction(
        this.agreement.tokenName,
        this.agreement.tokenSymbol,
        this.agreement.decimalPlaces,
        this.agreement.totalSupply,
        this.toEpoch(this.agreement.validFromDate, this.agreement.validFromHour, this.agreement.validFromMinute),
        this.toEpoch(this.agreement.expiresEndDate, this.agreement.expiresEndHour, this.agreement.expiresEndMinute),
        this.account,
        this.account,
        {from: this.account}
      );
    }).then((success) => {
      if (!success) {
        this.openSnackBar("Transaction failed!", "Dismiss");
      }
      else {
        this.newAgreement();
        this.openSnackBar("Transaction complete!", "Dismiss");
      }
    }).catch((e) => {
      this.openSnackBar("Error creating agreement; see log.", "Dismiss");
      console.log(e);
    });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

  fetch() {
    console.log("Fetching");

    this.Factory.then((contract) => {
      return contract.deployed();
    }).then((factoryInstance) => {
      return factoryInstance.agreements.call(1);
    }).then((factoryAgreement) => {
      console.log(factoryAgreement);
    }).catch(function (e) {
      console.log(e);
      // this.setStatus("Error getting agreement");
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  newAgreement() {
    this.agreement = new Agreement(null, null, null, null, new Date(), 0, 0, new Date(), 0, 0, this.account, null);
  }

  toEpoch(date: Date, hour: number, minute: number) {
    return Math.round(date.getTime() / 1000) + hour * 60 * 60 + minute * 60;
  }

  tester1() {
    return this.toEpoch(this.agreement.validFromDate, this.agreement.validFromHour, this.agreement.validFromMinute);
  }

  tester2() {
    return this.toEpoch(this.agreement.expiresEndDate, this.agreement.expiresEndHour, this.agreement.expiresEndMinute);
  }
}
