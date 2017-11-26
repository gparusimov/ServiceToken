import { Component } from '@angular/core';
import { Web3Service } from "../../web3/web3.service";
import { MatSnackBar } from '@angular/material';
import { Subscription } from "rxjs";
import { AccountComponent } from "../../account/account.component";

@Component({
  selector: 'app-agreement-list',
  templateUrl: './agreement-list.component.html',
  styleUrls: ['./agreement-list.component.css']
})

export class AgreementListComponent extends AccountComponent {

  private filter: any;
  private agreements: string[];

  constructor(web3Service : Web3Service, private snackBar: MatSnackBar) {
    super(web3Service);
  }

  web3OnAccount() {
    this.setAgreements();
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

  setAgreements() {
    this.web3Service.AgreementFactory.deployed().then((factoryInstance) => {
      return factoryInstance.getAgreements.call();
    }).then((agreements) => {
      this.agreements = agreements;
    }).catch(function (e) {
      console.log(e);
    });
  }

  watchAgreements() {
    this.web3Service.AgreementFactory.deployed().then ((factoryInstance) => {
      return factoryInstance.Agreement({fromBlock: "latest"});
    }).then ((agreements) => {
      agreements.watch((error, result) => {
        if (error == null) {
          this.snackBar.open("Agreement " + result.args.agreement + " created.", "Dismiss", { duration: 2000 });
          this.setAgreements();
        }
      });
      this.filter = agreements;
    }).catch(function (e) {
      console.log(e);
    });
  }

}
