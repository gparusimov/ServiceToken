import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MatList, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Web3Service } from "../../web3/web3.service";
import { Agreement } from "../agreement";
import { default as pdfMake } from 'pdfmake/build/pdfmake';
import { default as vfs } from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-agreement-detail',
  templateUrl: './agreement-detail.component.html',
  styleUrls: ['./agreement-detail.component.css']
})
export class AgreementDetailComponent implements OnInit {

  @Input() private agreement: Agreement;
  @Input() private account: string;

  @Output() onProposed = new EventEmitter<string>();
  @Output() onWithdrawn = new EventEmitter<null>();
  @Output() onAccepted = new EventEmitter<string>();
  @Output() onRejected = new EventEmitter<null>();

  private isMatching: boolean;

  constructor(
    private web3Service : Web3Service,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.isMatching = false;
  }

  isAccount(account: string): boolean {
    if (this.agreement[account]) {
      return (this.agreement[account].toLowerCase() === this.account.toLowerCase());
    } else {
      return false;
    }
  }

  onTest(event) {
    var file = event.srcElement.files[0];
    console.log(file);

    var reader = new FileReader();

    reader.onload = (e) => {
      var hash = this.web3Service.sha3(reader.result);

      if (hash === this.agreement.contentHash) {
        this.isMatching = true;
      } else {
        this.isMatching = false;
      }
    }

    reader.readAsBinaryString(file);
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

    proposeDialogRef.afterClosed().subscribe(result => {
      this.onProposed.emit(result);
    });
  }

  onAccept() {
    let acceptDialogRef = this.dialog.open(AcceptDialog, {
      width: '400px',
      data: { hash: "" }
    });

    acceptDialogRef.afterClosed().subscribe(result => {
      this.onAccepted.emit(result);
    });
  }

  onReject() {
    this.onRejected.emit();
  }

  onWithdraw() {
    this.onWithdrawn.emit();
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
