import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from "./web3/web3.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  private account: string;
  private accounts : string[];
  private subscription: Subscription;

  constructor(private web3Service : Web3Service) {
  }

  ngOnInit() {
    this.watchAccount();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  watchAccount() {
    this.subscription = this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

}
