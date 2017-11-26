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
import { default as Mustache } from 'mustache';
import template from '../agreement.json';
import { default as Web3 } from 'web3';

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
    this.web3Service.ServiceAgreement.at(this.agreement.address).then ((agreementInstance) => {
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
    return this.web3Service.agreement(address);
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
      data: { hash: this.agreement.contentHash, isMatching: false, agreement: this.agreement.address }
    });
  }

  onDownload() {
    let downloadDialogRef = this.dialog.open(DownloadDialog, {
      width: '400px',
      data: { agreement: {
        issuerName: null,
        beneficiaryName: null,
        issuerAddress: null,
        beneficiaryAddress: null,
        price: this.agreement.price,
        currency: "ETH",
        notice: 0
      }}
    });

    downloadDialogRef.afterClosed().subscribe(agreement => {

      if (agreement) {

        this.web3Service.genesisBlock().then((genesisBlock) => {
          var view = {
            validFrom: this.agreement.validFromAsISOString,
            expiresEnd: this.agreement.expiresEndAsISOString,
            beneficiary: this.agreement.beneficiary,
            beneficiaryName: agreement.beneficiaryName,
            beneficiaryAddress: agreement.beneficiaryAddress,
            issuer: this.agreement.issuer,
            issuerName: agreement.issuerName,
            issuerAddress: agreement.issuerAddress,
            agreementAddress: this.agreement.address,
            notice: agreement.notice,
            genesisHash: genesisBlock.hash,
            totalSupply: this.agreement.totalSupply,
            price: () => {
              if (agreement.currency === "ETH") {
                return Web3.utils.fromWei(agreement.price, "ether");
              } else {
                return agreement.price;
              }
            },
            currency: agreement.currency,
            total: () => {
              let total = this.agreement.totalSupply * agreement.price;

              if (agreement.currency === "ETH") {
                return Web3.utils.fromWei(total, "ether");
              } else {
                return total;
              }
            }
          };

          var output = Mustache.render(JSON.stringify(template), view);

          pdfMake.vfs = vfs.pdfMake.vfs;
          pdfMake.createPdf(JSON.parse(output)).download('fft-agreement.pdf');
        });
      }
    });
  }

  onPropose() {
    let proposeDialogRef = this.dialog.open(ProposeDialog, {
      width: '400px',
      data: { hash: "", agreement: this.agreement.address }
    });

    proposeDialogRef.afterClosed().subscribe(tripleHash => {
      if (tripleHash) {
        this.web3Service.ServiceAgreement.at(this.agreement.address).then((factoryInstance) => {
          return factoryInstance.propose.sendTransaction(
            tripleHash,
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
      data: { hash: "", agreement: this.agreement.address }
    });

    acceptDialogRef.afterClosed().subscribe(doubleHash => {
      if (doubleHash) {

        this.web3Service.ServiceAgreement.at(this.agreement.address).then((factoryInstance) => {
          return factoryInstance.accept.sendTransaction(
            doubleHash,
            {
              from: this.defaultAccount,
              value: (this.agreement.totalSupply * this.agreement.price)
            }
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
    this.web3Service.ServiceAgreement.at(this.agreement.address).then((factoryInstance) => {
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
    this.web3Service.ServiceAgreement.at(this.agreement.address).then((factoryInstance) => {
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
    let file = event.srcElement.files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
      let contentHash = this.web3Service.sha3(reader.result);
      this.data.hash = this.web3Service.sha3hex(this.web3Service.sha3hex(contentHash));
      localStorage.setItem(this.data.agreement, contentHash);
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
      let contentHash = this.web3Service.sha3(reader.result);
      localStorage.setItem(this.data.agreement, contentHash);
      this.data.hash = this.web3Service.sha3hex(contentHash);
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
    let file = event.srcElement.files[0];
    console.log(file);

    let reader = new FileReader();

    reader.onload = (e) => {
      let contentHash = this.web3Service.sha3(reader.result)
      let hash = this.web3Service.sha3hex(contentHash);

      if (hash === this.data.hash) {
        this.data.isMatching = true;
        localStorage.setItem(this.data.agreement, contentHash);
      } else {
        this.data.isMatching = false;
      }
    }

    reader.readAsBinaryString(file);
  }
}

@Component({
  selector: 'download-dialog',
  templateUrl: 'download-dialog.html',
})

export class DownloadDialog {

  constructor(
    public dialogRef: MatDialogRef<DownloadDialog>,
    private web3Service : Web3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
