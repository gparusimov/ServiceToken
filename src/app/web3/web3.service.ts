import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { default as Web3 } from 'web3';
import { WindowRefService } from "../window-ref/window-ref.service";
import { BehaviorSubject } from "rxjs";
import { default as contract } from 'truffle-contract';
import factory_artifacts from '../../../build/contracts/FlexiTimeFactory.json';
import agreement_artifacts from '../../../build/contracts/FlexiTimeAgreement.json';
import token_artifacts from '../../../build/contracts/FlexiTimeToken.json';
import task_artifacts from '../../../build/contracts/FlexiTimeTask.json'
import { Token } from "../token/token";
import { Agreement } from "../agreement/agreement";

@Injectable()
export class Web3Service {

  private web3 : Web3;
  private accounts : string[];
  public ready : boolean = false;
  public FlexiTimeFactory : any;
  public FlexiTimeAgreement : any;
  public FlexiTimeToken : any;
  public FlexiTimeTask : any;
  public accountsObservable = new BehaviorSubject<string[]>([]);

  constructor(private windowRef : WindowRefService) {
    this.FlexiTimeFactory = contract(factory_artifacts);
    this.FlexiTimeAgreement = contract(agreement_artifacts);
    this.FlexiTimeToken = contract(token_artifacts);
    this.FlexiTimeTask = contract(task_artifacts);
    setInterval(() => this.checkAndRefreshWeb3(), 100);
  }

  public genesisBlock(): Promise<any> {
    return this.web3.eth.getBlock(0);
  }

  public sha3(input: string): string {
    return this.web3.utils.sha3(input);
  }

  public sha3hex(input: string): string {
    return this.web3.utils.sha3(input, {encoding: "hex"});
  }

  private checkAndRefreshWeb3() {

    if (this.ready) {
      this.refreshAccounts();
      return;
    }

    if (this.windowRef.nativeWindow) {
      if (this.windowRef.nativeWindow.web3) {
        console.log('Using provided web3 implementation');
        this.web3 = new Web3(this.windowRef.nativeWindow.web3.currentProvider);
        this.FlexiTimeFactory.setProvider(this.web3.currentProvider);
        this.FlexiTimeAgreement.setProvider(this.web3.currentProvider);
        this.FlexiTimeToken.setProvider(this.web3.currentProvider);
        this.FlexiTimeTask.setProvider(this.web3.currentProvider);
        this.refreshAccounts();
      }
      else {
        console.log("Not finding web3");
      }
    }
    else {
      console.log("Can't get window reference");
    }
  };

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      if (!this.accounts || this.accounts.length != accs.length || this.accounts[0] != accs[0]) {
        console.log("Observed new accounts");
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      this.ready = true;
    });
  }

}
