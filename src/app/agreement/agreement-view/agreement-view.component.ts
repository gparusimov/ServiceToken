import { Component, OnInit, Input, Output, Inject, EventEmitter  } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Web3Service } from "../../web3/web3.service";
import { MatSnackBar, MatDialog, MatDialogRef, MatList, MAT_DIALOG_DATA } from '@angular/material';
import { AccountComponent } from "../../account/account.component";
import { Router } from '@angular/router';
import { Agreement } from "../agreement";
import { default as pdfMake } from 'pdfmake/build/pdfmake';
import { default as vfs } from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-agreement-view',
  templateUrl: './agreement-view.component.html',
  styleUrls: ['./agreement-view.component.css']
})

export class AgreementViewComponent extends AccountComponent {

  private isMatching: boolean;
  private agreement: Agreement;
  private filter: any;

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

  web3OnAccount() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getAgreement(params.get('address')))
    .subscribe(agreement => { this.agreement = agreement; this.watchAgreements(); });
  }

  ngOnInit() {
    super.ngOnInit();
    this.isMatching = false;
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
          });
        }
      });
      this.filter = stateChanges;
    });
  }

  getAgreement(address: string): Promise<Agreement> {
    let agreement = new Agreement(
      address, "", null, null, null, null, null, null, null, null, null, null, null
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

  isAccount(account: string): boolean {
    if (this.agreement[account]) {
      return (this.agreement[account].toLowerCase() === this.defaultAccount.toLowerCase());
    } else {
      return false;
    }
  }

  onTest() {
    let testDialogRef = this.dialog.open(TestDialog, {
      width: '400px',
      data: { hash: this.agreement.contentHash, isMatching: false }
    });
  }

  onPrint() {
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

  onPropose() {
    let proposeDialogRef = this.dialog.open(ProposeDialog, {
      width: '400px',
      data: { hash: "" }
    });

    proposeDialogRef.afterClosed().subscribe(doubleHash => {
      if (doubleHash) {
        this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
          return factoryInstance.propose.sendTransaction(
            doubleHash,
            {from: this.defaultAccount}
          );
        }).then((success) => {
          if (!success) {
            this.snackBar.open("Propose transaction failed!", "Dismiss", { duration: 2000 });
          }
          else {
            this.snackBar.open("Propose transaction submitted!", "Dismiss", { duration: 2000 });
          }
        }).catch(function (e) {
          this.snackBar.open("Propose transaction error; see log.", "Dismiss", { duration: 2000 });
          console.log(e);
        });
      } else {
        console.log('cancel');
      }
    });
  }

  onAccept() {
    let acceptDialogRef = this.dialog.open(AcceptDialog, {
      width: '400px',
      data: { hash: "" }
    });

    acceptDialogRef.afterClosed().subscribe(singleHash => {
      if (singleHash) {
        console.log('accept');

        this.web3Service.FlexiTimeAgreement.at(this.agreement.address).then((factoryInstance) => {
          return factoryInstance.accept.sendTransaction(
            singleHash,
            {from: this.defaultAccount}
          );
        }).then((success) => {
          if (!success) {
            this.snackBar.open("Accept transaction failed!", "Dismiss", { duration: 2000 });
          }
          else {
            this.snackBar.open("Accept transaction submitted!", "Dismiss", { duration: 2000 });
          }
        }).catch(function (e) {
          this.snackBar.open("Accept transaction error; see log.", "Dismiss", { duration: 2000 });
          console.log(e);
        });
      } else {
        console.log('cancel');
      }
    });
  }

  onReject () {
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
      }
    }).catch(function (e) {
      this.snackBar.open("Reject transaction error; see log.", "Dismiss", { duration: 2000 });
      console.log(e);
    });
  }

  onWithdraw() {
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
      }
    }).catch(function (e) {
      this.snackBar.open("Withdraw transaction error; see log.", "Dismiss", { duration: 2000 });
      console.log(e);
    });
  }

  goBack(): void {
    this.location.back();
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

@Component({
  selector: 'test-dialog',
  templateUrl: 'test-dialog.html',
})

export class TestDialog {

  constructor(
    public dialogRef: MatDialogRef<TestDialog>,
    private web3Service : Web3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onDone(): void {
    this.dialogRef.close();
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);

    var reader = new FileReader();

    reader.onload = (e) => {
      var hash = this.web3Service.sha3(reader.result);

      if (hash === this.data.hash) {
        this.data.isMatching = true;
      } else {
        this.data.isMatching = false;
      }
    }

    reader.readAsBinaryString(file);
  }
}
