import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { AccountComponent } from "../../account/account.component";
import { Web3Service } from "../../web3/web3.service";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Token } from "../token";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.css']
})
export class TokenViewComponent extends AccountComponent {

  private token: Token;
  private filter: any;

  constructor(
    web3Service : Web3Service,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(web3Service);
  }

  //TODO
  ngOnDestroy() {
    super.ngOnDestroy();
    // this.filter.stopWatching((error, result) => {
    //   if (error == null) {
    //     console.log("stopped watching");
    //   }
    // });
  }

  web3OnAccount() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getToken(params.get('address')))
    .subscribe(token => { this.token = token; this.watchTasks(); });
  }

  //TODO
  getToken(address: string): Promise<Token> {
    let token = new Token(
      address, null, null, null
    );

    this.web3Service.FlexiTimeToken.at(address).then((factoryInstance) => {
      return factoryInstance.agreement.call();
    }).then((value) => {
      token.agreement = value;
    }).catch(function (e) {
      console.log(e);
    });

    this.web3Service.FlexiTimeToken.at(address).then((factoryInstance) => {
      return factoryInstance.balanceOf.call(this.defaultAccount);
    }).then((value) => {
      token.balance = value;
    }).catch(function (e) {
      console.log(e);
    });

    this.web3Service.FlexiTimeToken.at(address).then((factoryInstance) => {
      return factoryInstance.getTasks.call();
    }).then((value) => {
      token.tasks = value;
    }).catch(function (e) {
      console.log(e);
    });

    return Promise.resolve(token);
  }

  //TODO
  watchTasks() {

  }

  //TODO
  onTransfer() {
    let transferDialogRef = this.dialog.open(TransferDialog, {
      width: '400px',
      data: { hash: "" }
    });

    transferDialogRef.afterClosed().subscribe(result => {


      this.web3Service.FlexiTimeToken.at(this.token.address).then((factoryInstance) => {

        console.log('transfer');
        console.log(factoryInstance);

        return factoryInstance.transfer.sendTransaction(
          "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
          20,
          {from: this.defaultAccount}
        );
      }).then((success) => {
        if (!success) {
          this.snackBar.open("Transaction failed!", "Dismiss", { duration: 2000 });
        }
        else {
          this.snackBar.open("Transaction submitted!", "Dismiss", { duration: 2000 });
        }
      }).catch((e) => {
        this.snackBar.open("Error creating agreement; see log.", "Dismiss", { duration: 2000 });
        console.log(e);
      });
    });
  }

  //TODO
  onTask() {
    let TaskDialogRef = this.dialog.open(TaskDialog, {
      width: '400px',
      data: { hash: "" }
    });

    TaskDialogRef.afterClosed().subscribe(result => {
      //this.onProposed.emit(result);
    });
  }

  goBack(): void {
    this.location.back();
  }

}

@Component({
  selector: 'transfer-dialog',
  templateUrl: 'transfer-dialog.html',
})

export class TransferDialog {

  constructor(
    public dialogRef: MatDialogRef<TransferDialog>,
    private web3Service : Web3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onChange(event) {

  }
}

@Component({
  selector: 'task-dialog',
  templateUrl: 'task-dialog.html',
})

export class TaskDialog {

  constructor(
    public dialogRef: MatDialogRef<TaskDialog>,
    private web3Service : Web3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onDone(): void {
    this.dialogRef.close();
  }

  onChange(event) {

  }
}
