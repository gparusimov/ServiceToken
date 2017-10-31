import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Web3Service } from "../../web3/web3.service";
import { default as pdfMake } from 'pdfmake/build/pdfmake';
import { default as vfs } from 'pdfmake/build/vfs_fonts';
import { MatSnackBar, MatDialog, MatDialogRef, MatList, MAT_DIALOG_DATA } from '@angular/material';
import { AccountComponent } from "../../account/account.component";
import { Router } from '@angular/router';

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
    public state: any,
    public token: any
  ) { }
}

@Component({
  selector: 'app-agreement-view',
  templateUrl: './agreement-view.component.html',
  styleUrls: ['./agreement-view.component.css']
})

export class AgreementViewComponent extends AccountComponent {

  @Input() private agreement: Agreement;

  private filter: any;
  private changed: boolean; // has the transaction been proposed but not confirmed

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    web3Service : Web3Service,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {
    super(web3Service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.changed = false;
  }

  web3OnAccount() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getAgreement(params.get('address')))
    .subscribe(agreement => { this.agreement = agreement; this.watchAgreements(); });
  }

  ngOnDestroy() {
     super.ngOnDestroy();
     this.filter.stopWatching((error, result) => {
       if (error == null) {
         console.log("stopped watching");
       }
     });
  }

  watchAgreements() {
    this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then ((agreementInstance) => {
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

  getAgreement(address: string): Promise<Agreement> {
    let agreement = new Agreement(
      address, null, null, null, null, null, null, null, null, null, null, null
    );

    let keys = [
      'name', 'symbol', 'decimals', 'totalSupply', 'validFrom', 'expiresEnd',
      'contentHash', 'issuer', 'beneficiary', 'state', 'token'
    ];

    for (let key of keys){
      this.web3Service.FlexiTimeAgreement.at(address).then((factoryInstance) => {
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

  isAccount(account: string): boolean {
    if (this.agreement[account]) {
      return (this.agreement[account].toLowerCase() === this.defaultAccount.toLowerCase());
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
    let proposeDialogRef = this.dialog.open(ProposeDialog, {
      width: '400px',
      data: { hash: "" }
    });

    proposeDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('propose');

        this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
          return factoryInstance.propose.sendTransaction(
            result,
            {from: this.defaultAccount}
          );
        }).then((success) => {
          if (!success) {
            this.snackBar.open("Propose transaction failed!", "Dismiss", { duration: 2000 });
          }
          else {
            this.snackBar.open("Propose transaction submitted!", "Dismiss", { duration: 2000 });
            this.changed = true;
          }
        }).catch(function (e) {
          this.snackBar.open("Propose transaction error; see log.", "Dismiss", { duration: 2000 });
          // this.status = "Error creating agreement; see log.";
          console.log(e);
        });
      } else {
        console.log('cancel');
      }
    });
  }

  accept() {
    // TODO: this create a new token contract, so watch for that
    // TODO: do a pop-up to supply the single hash
    // TODO: watch for newly created


    let acceptDialogRef = this.dialog.open(AcceptDialog, {
      width: '400px',
      data: { agreement: this.agreement }
    });

    acceptDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('accept');

        this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
          return factoryInstance.accept.sendTransaction(
            result,
            {from: this.defaultAccount}
          );
        }).then((success) => {
          if (!success) {
            this.snackBar.open("Accept transaction failed!", "Dismiss", { duration: 2000 });
          }
          else {
            this.snackBar.open("Accept transaction submitted!", "Dismiss", { duration: 2000 });
            this.changed = true;
          }
        }).catch(function (e) {
          this.snackBar.open("Accept transaction error; see log.", "Dismiss", { duration: 2000 });
          // this.status = "Error creating agreement; see log.";
          console.log(e);
        });
      } else {
        console.log('cancel');
      }
    });
  }

  reject () {
    this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
      return factoryInstance.reject.sendTransaction(
        {from: this.defaultAccount}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Reject transaction failed!", "Dismiss", { duration: 2000 });
      }
      else {
        this.snackBar.open("Reject transaction submitted!", "Dismiss", { duration: 2000 });
        this.changed = true;
      }
    }).catch(function (e) {
      this.snackBar.open("Reject transaction error; see log.", "Dismiss", { duration: 2000 });
      // this.status = "Error creating agreement; see log.";
      console.log(e);
    });
  }

  withdraw() {
    this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
      return factoryInstance.withdraw.sendTransaction(
        {from: this.defaultAccount}
      );
    }).then((success) => {
      if (!success) {
        this.snackBar.open("Withdraw transaction failed!", "Dismiss", { duration: 2000 });
      }
      else {
        this.snackBar.open("Withdraw transaction submitted!", "Dismiss", { duration: 2000 });
        this.changed = true;
      }
    }).catch(function (e) {
      this.snackBar.open("Withdraw transaction error; see log.", "Dismiss", { duration: 2000 });
      // this.status = "Error creating agreement; see log.";
      console.log(e);
    });
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

  sign() {
    this.web3Service.sign(this.defaultAccount, "0x8aab0093e9179e31a7995597d74b49ea530304172245d35ab24b6766eb2780b2").then((result) => {
      console.log(result);
    }).catch(function (e) {
      console.log(e);
    });
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);

    var reader = new FileReader();

    reader.onload = (e) => {
      var hash = this.web3Service.sha3(reader.result);

      if (hash === this.agreement.contentHash) {
        this.snackBar.open("Document hash matches.", "Dismiss", { duration: 2000 });
      } else {
        this.snackBar.open("Document hash does not match!", "Dismiss", { duration: 2000 });
      }
    }

    reader.readAsBinaryString(file);
  }
}

@Component({
  selector: 'propose-dialog',
  templateUrl: 'propose-dialog.html',
})

export class ProposeDialog {

  constructor(
    public dialogRef: MatDialogRef<ProposeDialog>,
    private web3Service : Web3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);

    var reader = new FileReader();

    reader.onload = (e) => {
      this.data.hash = this.web3Service.sha3hex(this.web3Service.sha3(reader.result));
    }

    reader.readAsBinaryString(file);
  }
}

@Component({
  selector: 'accept-dialog',
  templateUrl: 'accept-dialog.html',
})

export class AcceptDialog {

  constructor(
    public dialogRef: MatDialogRef<AcceptDialog>,
    private web3Service : Web3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);

    var reader = new FileReader();

    reader.onload = (e) => {
      this.data.hash = this.web3Service.sha3(reader.result);
    }

    reader.readAsBinaryString(file);
  }
}
