import { Component } from '@angular/core';
import { Web3Service } from "./web3/web3.service";
import { Subscription } from "rxjs";
import { AccountComponent } from "./account/account.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent extends AccountComponent {

  constructor(web3Service : Web3Service) {
    super(web3Service);
  }

  web3OnAccount() {
    console.log("onAccount");
  }

}
