import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Subscription } from "rxjs";
import { Web3Service } from "../../web3/web3.service";
import { default as pdfMake } from 'pdfmake/build/pdfmake';
import { default as vfs } from 'pdfmake/build/vfs_fonts';
import { MatSnackBar } from '@angular/material';

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

  @Input() private agreement: Agreement;

  private AgreementContract: Promise<any>;
  private accounts : string[];
  private account: string;
  private subscription: Subscription;
  private filter: any;
  private changed: boolean; // has the transaction been proposed but not confirmed

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private web3Service : Web3Service,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.watchAccount();

    this.route.paramMap
    .switchMap((params: ParamMap) => this.getAgreement(params.get('address')))
    .subscribe(agreement => this.agreement = agreement);

    this.changed = false;

    this.watchAgreementEvents();
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
     this.filter.stopWatching((error, result) => {
       if (error == null) {
         console.log("stopped watching");
       }
     });
  }

  watchAgreementEvents() {
    this.AgreementContract.then((contract) => {
      return contract.at(this.agreement.address);
    }).then ((agreementInstance) => {
      return agreementInstance.StateChange({fromBlock: "latest"});
    }).then ((stateChanges) => {
      stateChanges.watch((error, result) => {
        if (error == null) {
          console.log(result.args);
          this.snackBar.open("State changed.", "Dismiss", { duration: 2000 });
          this.getAgreement(this.agreement.address).then((agreement) => {
            this.agreement = agreement;
            this.changed = false;
          });
        }
      });
      this.filter = stateChanges;
    });
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
      return ((this.agreement.beneficiary.toLowerCase() === this.account.toLowerCase()) && (this.inState(state)));
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
    this.AgreementContract.then((contract) => {
      return contract.at(this.agreement.address);
    }).then((factoryInstance) => {
      return factoryInstance.propose.sendTransaction(
        '0x94fkbekedhf7',
        {from: this.account}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Transaction failed!", "Dismiss", { duration: 2000 });
      }
      else {
        this.snackBar.open("Transaction submitted!", "Dismiss", { duration: 2000 });
        this.changed = true;
      }
    }).catch(function (e) {
      this.snackBar.open("Error creating agreement; see log.", "Dismiss", { duration: 2000 });
      // this.status = "Error creating agreement; see log.";
      console.log(e);
    });
  }

  accept() {
    //TODO: this create a new token contract, so watch for that
  }

  reject () {
    //TODO: this should be simpler
  }

  withdraw() {
    //TODO: this should be simpler
  }

  print() {
    let docDefinition = {
      styles: {
        centerStyle: {
         italic: true,
         alignment: 'center'
        }
      },
      header: 'FlexiTime Token Agreement',
      footer: new Date(),
      content: [
        { text: 'FlexiTime Token Agreement', style: [ 'centerStyle' ] },
        'Address: ' + this.agreement.address,
        'Name: ' + this.agreement.name,
        'Symbol: ' + this.agreement.symbol
      ]
    };

    pdfMake.vfs = vfs.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).download('optionalName.pdf');
  }
}
