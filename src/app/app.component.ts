import { Component, OnInit } from '@angular/core';
import { Web3Service } from "./web3/web3.service";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  accounts : string[];
  account: string;
  Factory : Promise<any>;

  constructor(private web3Service : Web3Service, public snackBar: MatSnackBar) {
    console.log("AccountComponent constructor: " + web3Service);
  }

  ngOnInit() {
    this.watchAccount();

    this.Factory = new Promise((resolve, reject) => {
      setInterval(() => {
        if (this.web3Service.ready) {
          resolve(this.web3Service.FlexiTimeFactory);
        }
      }, 100)
    });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

  create() {
    console.log("Creating");

    this.Factory.then((contract) => {
      return contract.deployed();
    }).then((factoryInstance) => {
      return factoryInstance.createAgreement.sendTransaction("FlexiTimeToken", "FTT", 0, 240, 1508252290, 1508252290, this.account, this.account, {from: this.account});
    }).then((success) => {
      if (!success) {
        this.openSnackBar("Transaction failed!", "Dismiss");
      }
      else {
        this.openSnackBar("Transaction complete!", "Dismiss");
      }
    }).catch((e) => {
      this.openSnackBar("Error creating agreement; see log.", "Dismiss");
      console.log(e);
      
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
}
