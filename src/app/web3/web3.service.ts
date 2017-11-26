import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { default as Web3 } from 'web3';
import { WindowRefService } from "../window-ref/window-ref.service";
import { BehaviorSubject } from "rxjs";
import { default as contract } from 'truffle-contract';
import factory_artifacts from '../../../build/contracts/AgreementFactory.json';
import agreement_artifacts from '../../../build/contracts/ServiceAgreement.json';
import token_artifacts from '../../../build/contracts/ServiceToken.json';
import task_artifacts from '../../../build/contracts/ServiceTask.json'
import { Token } from "../token/token";
import { Agreement } from "../agreement/agreement";
import { Task } from "../task/task";

@Injectable()
export class Web3Service {

  private web3 : Web3;
  private accounts : string[];
  public ready : boolean = false;
  public AgreementFactory : any;
  public ServiceAgreement : any;
  public ServiceToken : any;
  public ServiceTask : any;
  public accountsObservable = new BehaviorSubject<string[]>([]);

  constructor(private windowRef : WindowRefService) {
    this.AgreementFactory = contract(factory_artifacts);
    this.ServiceAgreement = contract(agreement_artifacts);
    this.ServiceToken = contract(token_artifacts);
    this.ServiceTask = contract(task_artifacts);
    setInterval(() => this.checkAndRefreshWeb3(), 100);
  }

  public task(address: string): Promise<any> {
    return new Promise((resolve) => {
      let task = new Task(address);
      let taskInstance = this.ServiceTask.at(address);

      this.properties(task, taskInstance, ["name", "state", "token"]).then(() => {
        resolve(task);
      });
    }).then((task: Task) => {
      return new Promise((resolve) => {
        this.token(task.token).then((token) => {
          task.token = token;
          resolve(task);
        })
      });
    });
  }

  public token(address: string): Promise<any> {
    return new Promise((resolve) => {
      let token = new Token(address);
      let tokenInstance = this.ServiceToken.at(address);

      this.properties(token, tokenInstance, ["taskArray", "agreement"]).then(() => {
        resolve(token);
      });
    }).then((token: Token) => {
      return new Promise((resolve) => {
        this.agreement(token.agreement).then((agreement) => {
          token.agreement = agreement;
          resolve(token);
        })
      });
    });
  }

  public agreement(address: string): Promise<any> {
    return new Promise((resolve) => {
      let agreement = new Agreement(address);
      let agreementInstance = this.ServiceAgreement.at(address);

      this.properties(agreement, agreementInstance, [
        "issuer", "beneficiary", "name", "symbol", "decimals", "totalSupply", "validFrom",
        "expiresEnd", "contentHash", "price", "state", "token"
      ]).then((results) => {
        resolve(agreement);
      });
    });
  }

  private properties(object: any, instance: any, keys: string[]): Promise<any> {
    let promises:Array<any> = [];

    for (let key of keys) {
      promises.push(new Promise((resolve) => {
        instance[key].call().then((value) => {
          object[key] = value;
          resolve(value);
        }).catch(function (e) {
          console.log(e);
        });
      }));
    }

    return Promise.all(promises);
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
        this.AgreementFactory.setProvider(this.web3.currentProvider);
        this.ServiceAgreement.setProvider(this.web3.currentProvider);
        this.ServiceToken.setProvider(this.web3.currentProvider);
        this.ServiceTask.setProvider(this.web3.currentProvider);
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
