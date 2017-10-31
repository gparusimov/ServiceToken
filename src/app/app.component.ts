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

  onSign() {
    this.web3Service.sign(this.defaultAccount, "0x8aab0093e9179e31a7995597d74b49ea530304172245d35ab24b6766eb2780b2").then((result) => {
      console.log(result);
    }).catch(function (e) {
      console.log(e);
    });
  }

}
