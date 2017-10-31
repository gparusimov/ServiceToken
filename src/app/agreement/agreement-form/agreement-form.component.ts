import { Component, Input } from '@angular/core';
import { Web3Service } from "../../web3/web3.service";
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountComponent } from "../../account/account.component";

export class Agreement {
  constructor(
    public address: string,
    public transaction: string,
    public status: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalSupply: number,
    public validFrom: string,
    public expiresEnd: string,
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
  private filter: any;

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
      "", "", null, null, null, null, null, null, null, null, null
    );
    this.submitted = false;
    this.confirmed = false;
    this.created = false;
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
          if (this.agreement.transaction === result.transactionHash) {
            this.snackBar.open("Agreement " + result.args.agreement + " created.", "Dismiss", { duration: 2000 });
            this.created = true;
            this.agreement.address = result.args.agreement;
            this.agreement.status = "Created";
          }
        }
      });
      this.filter = agreements;
    });
  }

  onSubmit() {
    this.submitted = true;
    this.agreement.status = "Confirming";

    this.web3Service.FlexiTimeFactory.deployed().then((factoryInstance) => {
      return factoryInstance.createAgreement.sendTransaction(
        this.agreement.name,
        this.agreement.symbol,
        this.agreement.decimals,
        this.agreement.totalSupply,
        this.toEpoch(this.agreement.validFrom),
        this.toEpoch(this.agreement.expiresEnd),
        this.agreement.issuer,
        this.agreement.beneficiary,
        {from: this.defaultAccount}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Transaction failed!", "Dismiss", { duration: 2000 });
        this.agreement.status = "Failed";
      }
      else {
        this.snackBar.open("Transaction submitted!", "Dismiss", { duration: 2000 });
        this.agreement.status = "Submitted";
        this.agreement.transaction = success;
        this.confirmed = true;
      }
    }).catch((e) => {
      this.snackBar.open("Error creating agreement; see log.", "Dismiss", { duration: 2000 });
      this.agreement.status = "Error";
      console.log(e);
    });
  }

  toEpoch(date: string) {
    return Math.round(new Date(date).getTime() / 1000);
  }

  goBack(): void {
    this.location.back();
  }
}
