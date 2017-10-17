import { Component, OnInit } from '@angular/core';
import { Web3Service } from "./web3/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  accounts : string[];
  account: string;
  Factory : Promise<any>;

  constructor(private web3Service : Web3Service) {
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

    // this.Factory.then((contract) => {
    //   return contract.deployed();
    // }).then((metaCoinInstance) => {
    //   return metaCoinInstance.sendCoin.sendTransaction(receiver, amount, {from: this.model.account});
    // }).then((success) => {
    //   if (!success) {
    //     this.setStatus("Transaction failed!");
    //   }
    //   else {
    //     this.setStatus("Transaction complete!");
    //   }
    // }).catch((e) => {
    //   console.log(e);
    //   this.setStatus("Error sending coin; see log.");
    // });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

}
