import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Web3Service } from "../../web3/web3.service";
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

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
    public beneficiaryAddress: string,
  ) { }
}

@Component({
  selector: 'app-agreement-form',
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css']
})

export class AgreementFormComponent implements OnInit, OnDestroy  {

  @Input() agreement: Agreement;

  private Factory: Promise<any>;
  private accounts : string[];
  private account: string;
  private submitted: boolean;
  private confirmed: boolean;
  private created: boolean;
  private status: string;
  private transaction: string;
  private subscription: Subscription;
  private filter: any;
  private agreementHash: string;

  constructor(
    private web3Service : Web3Service,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.watchAccount();
    this.setFactory();
    this.watchAgreementEvents();
    this.agreement = new Agreement(
      null, null, null, null, new Date(), 0, 0, new Date(), 0, 0, this.account, null
    );
    this.submitted = false;
    this.confirmed = false;
    this.created = false;
    this.status = "Creating transaction.";
    this.transaction = "";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.filter.stopWatching((error, result) => {
      if (error == null) {
        console.log("stopped watching");
      }
    });
  }

  watchAgreementEvents() {
    this.Factory.then((contract) => {
      return contract.deployed();
    }).then ((factoryInstance) => {
      return factoryInstance.Agreement({fromBlock: "latest"});
    }).then ((agreements) => {
      agreements.watch((error, result) => {
        if (error == null) {
          console.log(result);
          if (this.transaction === result.transactionHash) {
            this.snackBar.open("Agreement " + result.args.agreement + " created.", "Dismiss", { duration: 2000 });
            this.created = true;
            this.agreementHash = result.args.agreement;
            this.status = "Agreeement created.";
          }
        }
      });
      this.filter = agreements;
    });
  }

  setFactory() {
    this.Factory = new Promise((resolve, reject) => {
      setInterval(() => {
        if (this.web3Service.ready) {
          resolve(this.web3Service.FlexiTimeFactory);
        }
      }, 100)
    });
  }

  onSubmit() {
    this.submitted = true;
    this.status = "Confirming transaction.";

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
        this.agreement.issuerAddress,
        this.agreement.beneficiaryAddress,
        {from: this.account}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Transaction failed!", "Dismiss", { duration: 2000 });
        this.status = "Transaction failed!";
      }
      else {
        this.snackBar.open("Transaction submitted!", "Dismiss", { duration: 2000 });
        this.status = "Transaction submitted.";
        this.transaction = success;
        this.confirmed = true;
      }
    }).catch((e) => {
      this.snackBar.open("Error creating agreement; see log.", "Dismiss", { duration: 2000 });
      this.status = "Error creating agreement; see log.";
      console.log(e);
    });
  }

  toEpoch(date: Date, hour: number, minute: number) {
    return Math.round(date.getTime() / 1000) + hour * 60 * 60 + minute * 60;
  }

  watchAccount() {
    this.subscription = this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

  goBack(): void {
    this.location.back();
  }
}
