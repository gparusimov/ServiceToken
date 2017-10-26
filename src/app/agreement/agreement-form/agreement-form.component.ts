import { Component, Input } from '@angular/core';
import { Web3Service } from "../../web3/web3.service";
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountComponent } from "../../account/account.component";

export class Agreement {
  constructor(
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalSupply: number,
    public validFromDate: Date,
    public validFromHour: number,
    public validFromMinute: number,
    public expiresEndDate: Date,
    public expiresEndHour: number,
    public expiresEndMinute: number,
    public issuer: string,
    public beneficiary: string,
  ) { }
}

@Component({
  selector: 'app-agreement-form',
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css']
})

export class AgreementFormComponent extends AccountComponent  {

  @Input() agreement: Agreement;

  private submitted: boolean;
  private confirmed: boolean;
  private created: boolean;
  private status: string;
  private transaction: string;
  private filter: any;
  private agreementHash: string;

  constructor(
    web3Service : Web3Service,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router
  ) {
    super(web3Service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.agreement = new Agreement(
      null, null, null, null, new Date(), 0, 0, new Date(), 0, 0, null, null
    );
    this.submitted = false;
    this.confirmed = false;
    this.created = false;
    this.status = "Creating transaction.";
    this.transaction = "";
  }

  web3OnAccount() {
    this.watchAgreements();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.filter.stopWatching((error, result) => {
      if (error == null) {
        console.log("stopped watching");
      }
    });
  }

  watchAgreements() {
    this.web3Service.FlexiTimeFactory.deployed().then ((factoryInstance) => {
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

  onSubmit() {
    this.submitted = true;
    this.status = "Confirming transaction.";

    this.web3Service.FlexiTimeFactory.deployed().then((factoryInstance) => {
      return factoryInstance.createAgreement.sendTransaction(
        this.agreement.name,
        this.agreement.symbol,
        this.agreement.decimals,
        this.agreement.totalSupply,
        this.toEpoch(this.agreement.validFromDate, this.agreement.validFromHour, this.agreement.validFromMinute),
        this.toEpoch(this.agreement.expiresEndDate, this.agreement.expiresEndHour, this.agreement.expiresEndMinute),
        this.agreement.issuer,
        this.agreement.beneficiary,
        {from: this.defaultAccount}
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

  goBack(): void {
    this.location.back();
  }
}
