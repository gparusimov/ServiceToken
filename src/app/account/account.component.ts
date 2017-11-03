import { OnInit, OnDestroy, Input } from '@angular/core';
import { Web3Service } from "../web3/web3.service";
import { Subscription } from "rxjs";

export abstract class AccountComponent implements OnInit, OnDestroy {

  protected defaultAccount: string;
  protected accounts : string[];
  protected accountsSubscription: Subscription;

  constructor(protected web3Service: Web3Service) {
    this.web3Service = web3Service;
  }

  ngOnInit() {
    this.accountsSubscription = this.web3Service.accountsObservable.subscribe((accounts) => {
      if (accounts.length > 0) {
        this.accounts = accounts;
        this.defaultAccount = accounts[0];
        this.web3OnAccount();
      }
    });
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
  }

  abstract web3OnAccount(): void;
}
