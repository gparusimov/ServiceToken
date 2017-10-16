import { Component, OnInit } from '@angular/core';
import { Web3Service } from "../web3/web3.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private web3Service : Web3Service) {
    console.log("AccountComponent constructor: " + web3Service);
  }

  ngOnInit() {
  }

}
