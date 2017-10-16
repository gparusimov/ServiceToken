import { Injectable } from '@angular/core';
import { default as Web3 } from 'web3';
import { WindowRefService } from "../window-ref/window-ref.service";

@Injectable()
export class Web3Service {

  private web3 : Web3;
  private accounts : string[];

  constructor(private windowRef : WindowRefService) {
    console.log("Web3Service constructor");

    setTimeout(() =>
    {
      if (this.windowRef.nativeWindow) {
        if (this.windowRef.nativeWindow.web3) {
          console.log('Using provided web3 implementation');
          this.web3 = new Web3(this.windowRef.nativeWindow.web3.currentProvider);
          // Bootstrap the MetaCoin abstraction for Use.
          // this.MetaCoin.setProvider(this.web3.currentProvider);
          // this.refreshAccounts();

          console.log("defaultAccount :" + this.windowRef.nativeWindow.web3.eth.defaultAccount);
        }
        else {
          console.log("Not finding web3");
        }
      }
      else {
        console.log("Can't get window reference");
      }
    },
    5000);







    //
    // this.web3.eth.getAccounts((err, accs) => {
    //   if (err != null) {
    //     alert("There was an error fetching your accounts.");
    //     return;
    //   }
    //
    //   // Get the initial account balance so it can be displayed.
    //   if (accs.length == 0) {
    //     alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
    //     return;
    //   }
    //
    //   if (!this.accounts || this.accounts.length != accs.length || this.accounts[0] != accs[0]) {
    //     console.log("Observed new accounts");
    //     this.accounts = accs;
    //     console.log(this.accounts);
    //   }
    //
    // });

    // if (typeof web3 !== 'undefined') {
    //   web3 = new Web3(web3.currentProvider);
    // } else {
    //   // set the provider you want from Web3.providers
    //   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // }

  }

}
