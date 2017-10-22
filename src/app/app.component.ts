import { Component, OnInit } from '@angular/core';
import { Web3Service } from "./web3/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  private account: string;
  private accounts : string[];

  constructor(private web3Service : Web3Service) {
  }

  ngOnInit() {
      this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }

}
