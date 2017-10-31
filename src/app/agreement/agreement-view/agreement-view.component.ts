import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Web3Service } from "../../web3/web3.service";
import { MatSnackBar, MatDialog, MatDialogRef, MatList, MAT_DIALOG_DATA } from '@angular/material';
import { AccountComponent } from "../../account/account.component";
import { Router } from '@angular/router';
import { Agreement } from "../agreement";

@Component({
  selector: 'app-agreement-view',
  templateUrl: './agreement-view.component.html',
  styleUrls: ['./agreement-view.component.css']
})

export class AgreementViewComponent extends AccountComponent {

  private agreement: Agreement;
  private filter: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    web3Service : Web3Service,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {
    super(web3Service);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  web3OnAccount() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getAgreement(params.get('address')))
    .subscribe(agreement => { this.agreement = agreement; this.watchAgreements(); });
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
    this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then ((agreementInstance) => {
      return agreementInstance.StateChange({fromBlock: "latest"});
    }).then ((stateChanges) => {
      stateChanges.watch((error, result) => {
        if (error == null) {
          console.log(result.args);
          this.snackBar.open("State changed.", "Dismiss", { duration: 2000 });
          this.getAgreement(this.agreement.address).then((agreement) => {
            this.agreement = agreement;
          });
        }
      });
      this.filter = stateChanges;
    });
  }

  getAgreement(address: string): Promise<Agreement> {
    let agreement = new Agreement(
      address, "", null, null, null, null, null, null, null, null, null, null, null, null
    );

    let keys = [
      'name', 'symbol', 'decimals', 'totalSupply', 'validFrom', 'expiresEnd',
      'contentHash', 'issuer', 'beneficiary', 'state', 'token'
    ];

    for (let key of keys){
      this.web3Service.FlexiTimeAgreement.at(address).then((factoryInstance) => {
        if (factoryInstance[key]) {
          return factoryInstance[key].call();
        } else {
          return null;
        }
      }).then((value) => {
        agreement[key] = value;
      }).catch(function (e) {
        console.log(e);
      });
    }

    return Promise.resolve(agreement);
  }

  onProposed(doubleHash: string) {
    if (doubleHash) {
      this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
        return factoryInstance.propose.sendTransaction(
          doubleHash,
          {from: this.defaultAccount}
        );
      }).then((success) => {
        if (!success) {
          this.snackBar.open("Propose transaction failed!", "Dismiss", { duration: 2000 });
        }
        else {
          this.snackBar.open("Propose transaction submitted!", "Dismiss", { duration: 2000 });
        }
      }).catch(function (e) {
        this.snackBar.open("Propose transaction error; see log.", "Dismiss", { duration: 2000 });
        console.log(e);
      });
    } else {
      console.log('cancel');
    }

  }

  onAccepted(singleHash) {
    if (singleHash) {
      console.log('accept');

      this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
        return factoryInstance.accept.sendTransaction(
          singleHash,
          {from: this.defaultAccount}
        );
      }).then((success) => {
        if (!success) {
          this.snackBar.open("Accept transaction failed!", "Dismiss", { duration: 2000 });
        }
        else {
          this.snackBar.open("Accept transaction submitted!", "Dismiss", { duration: 2000 });
        }
      }).catch(function (e) {
        this.snackBar.open("Accept transaction error; see log.", "Dismiss", { duration: 2000 });
        console.log(e);
      });
    } else {
      console.log('cancel');
    }
  }

  onRejected () {
    this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
      return factoryInstance.reject.sendTransaction(
        {from: this.defaultAccount}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Reject transaction failed!", "Dismiss", { duration: 2000 });
      }
      else {
        this.snackBar.open("Reject transaction submitted!", "Dismiss", { duration: 2000 });
      }
    }).catch(function (e) {
      this.snackBar.open("Reject transaction error; see log.", "Dismiss", { duration: 2000 });
      console.log(e);
    });
  }

  onWithdrawn() {
    this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
      return factoryInstance.withdraw.sendTransaction(
        {from: this.defaultAccount}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Withdraw transaction failed!", "Dismiss", { duration: 2000 });
      }
      else {
        this.snackBar.open("Withdraw transaction submitted!", "Dismiss", { duration: 2000 });
      }
    }).catch(function (e) {
      this.snackBar.open("Withdraw transaction error; see log.", "Dismiss", { duration: 2000 });
      console.log(e);
    });
  }

  onSign() {
    this.web3Service.sign(this.defaultAccount, "0x8aab0093e9179e31a7995597d74b49ea530304172245d35ab24b6766eb2780b2").then((result) => {
      console.log(result);
    }).catch(function (e) {
      console.log(e);
    });
  }

  goBack(): void {
    this.location.back();
  }
}
