import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Subscription } from "rxjs";
import { Web3Service } from "../../web3/web3.service";

export class Agreement {
  constructor(
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalSupply: number,
    public validFrom: Date,
    public expiresEnd: Date,
    public contentHash: string,
    public issuer: string,
    public beneficiary: string,
    public state: any
  ) { }
}

@Component({
  selector: 'app-agreement-view',
  templateUrl: './agreement-view.component.html',
  styleUrls: ['./agreement-view.component.css']
})

export class AgreementViewComponent implements OnInit, OnDestroy {

  private AgreementContract: Promise<any>;
  private accounts : string[];
  private account: string;
  private subscription: Subscription;
  private agreement: Agreement;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private web3Service : Web3Service
  ) {}

  ngOnInit(): void {
    this.watchAccount();

    this.route.paramMap
    .switchMap((params: ParamMap) => this.getAgreement(params.get('address')))
    .subscribe(agreement => this.agreement = agreement);
  }

  setAgreementPromise() {
    this.AgreementContract = new Promise((resolve, reject) => {
      setInterval(() => {
        if (this.web3Service.ready) {
          resolve(this.web3Service.FlexiTimeAgreement);
        }
      }, 100)
    });
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
  }

  getAgreement(address: string): Promise<Agreement> {

    let agreement = new Agreement(
      address, null, null, null, null, null, null, null, null, null, null
    );

    let keys = [
      'name', 'symbol', 'decimals', 'totalSupply', 'validFrom', 'expiresEnd',
      'contentHash', 'issuer', 'beneficiary', 'state'
    ];

    for (let key of keys){
      this.AgreementContract.then((contract) => {
        return contract.at(address);
      }).then((factoryInstance) => {
        if (factoryInstance[key]) {
          return factoryInstance[key].call();
        } else {
          return null;
        }
      }).then((value) => {
        agreement[key] = value;
      }).catch(function (e) {
        console.log(e);
      });
    }

    return Promise.resolve(agreement);
  }

  goBack(): void {
    this.location.back();
  }

  watchAccount() {
    this.subscription = this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
      this.setAgreementPromise();
    });
  }

  isIssuerInState(state: string): boolean {
    if (this.agreement.issuer) {
      return ((this.agreement.issuer.toLowerCase() == this.account.toLowerCase()) && (this.inState(state)));
    } else {
      return false;
    }
  }

  isBeneficiaryInState(state: string): boolean {
    if (this.agreement.beneficiary) {
      return ((this.agreement.beneficiary === this.account) && (this.inState(state)));
    } else {
      return false;
    }
  }

  inState(state: string): boolean {
    let result: boolean;

    if (this.agreement.state) {
      let stateNumber = this.agreement.state.toNumber();

      switch(state) {
        case "Created": {
          result = stateNumber == 0;
          break;
        }
        case "Proposed": {
          result = stateNumber == 1;
          break;
        }
        case "Withdrawn": {
          result = stateNumber == 2;
          break;
        }
        case "Accepted": {
          result = stateNumber == 4;
          break;
        }
        case "Rejected": {
          result = stateNumber == 5;
          break;
        }
        default: {
          result = false;
          break;
        }
      }
    }

    return result;
  }

  propose() {
    console.log('propose');

    this.AgreementContract.then((contract) => {
      return contract.at(this.agreement.address);
    }).then((factoryInstance) => {
      return factoryInstance.propose.sendTransaction(
        '0x94fkbekedhf7',
        {from: this.account}
      );
    }).then((success) => {
      if (!success) {
        console.log('failed');
      //   this.snackBar.open("Transaction failed!", "Dismiss", { duration: 2000 });
      //   this.status = "Transaction failed!";
      }
      else {
        console.log('success');
      //   this.snackBar.open("Transaction submitted!", "Dismiss", { duration: 2000 });
      //   this.status = "Transaction submitted.";
      //   this.transaction = success;
      //   this.confirmed = true;
      }
    }).catch(function (e) {
      // this.snackBar.open("Error creating agreement; see log.", "Dismiss", { duration: 2000 });
      // this.status = "Error creating agreement; see log.";
      console.log(e);
    });
  }
}
