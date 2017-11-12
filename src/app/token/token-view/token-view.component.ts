import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { AccountComponent } from "../../account/account.component";
import { Web3Service } from "../../web3/web3.service";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Token } from "../token";
import { Agreement } from "../../agreement/agreement";
import { default as CryptoJS } from 'crypto-js';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.css']
})
export class TokenViewComponent extends AccountComponent {

  private token: Token;
  private taskFilter: any;
  private transferFilter: any;

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

  ngOnDestroy() {
    super.ngOnDestroy();
    this.taskFilter.stopWatching((error, result) => {
      if (error == null) {
        console.log("stopped watching");
      }
    });
    this.transferFilter.stopWatching((error, result) => {
      if (error == null) {
        console.log("stopped watching");
      }
    });
  }

  web3OnAccount() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getToken(params.get('address')))
    .subscribe(token => {
      this.token = token;

      this.watchTasks();
      this.watchTransfers();
    });
  }

  getToken(address: string): Promise<Token> {
    return new Promise((resolve) => {
      this.web3Service.token(address).then((token) => {
        resolve(token);
      })
    })
    .then((token: Token) => {
      if (!localStorage.getItem(token.agreement.address)) {
        this.snackBar.open("Content hash not set in local storage!", "Dismiss", { duration: 2000 });
      }

      return new Promise((resolve) => {
        let promises:Array<any> = [];

        for (let account of [this.defaultAccount].concat(token.taskArray)) {
          promises.push(new Promise((resolve) => {
            this.web3Service.FlexiTimeToken.at(token.address).balanceOf.call(account).then((balance) => {
              token.balances.set(account, balance);
              resolve(balance);
            }).catch(function (e) {
              console.log(e);
            });
          }));
        }

        Promise.all(promises).then((results) => {
          resolve(token);
        })
      })
    });
  }

  watchTransfers() {
    this.web3Service.FlexiTimeToken.at(this.token.address).then ((tokenInstance) => {
      return tokenInstance.Transfer({
        fromBlock: "latest",
        topics: [[this.defaultAccount].concat(this.token.taskArray), [this.defaultAccount].concat(this.token.taskArray), null]
      });
    }).then ((transfers) => {
      transfers.watch((error, result) => {
        if (error == null) {

          console.log(result);

          this.snackBar.open("Tokens transfered.", "Dismiss", { duration: 2000 });
          this.getToken(this.token.address).then((token) => {
            this.token = token;
          });
        }
      });
      this.transferFilter = transfers;
    });
  }

  watchTasks() {
    this.web3Service.FlexiTimeToken.at(this.token.address).then ((tokenInstance) => {
      return tokenInstance.Task({fromBlock: "latest"});
    }).then ((tasks) => {
      tasks.watch((error, result) => {
        if (error == null) {
          this.snackBar.open("Task created.", "Dismiss", { duration: 2000 });
          this.getToken(this.token.address).then((token) => {
            this.token = token;
          });
        }
      });
      this.taskFilter = tasks;
    });
  }

  onTransfer() {
    let accounts = [];

    accounts.push({ owner: 'issuer', address: this.token.agreement.issuer });
    accounts.push({ owner: 'beneficiary', address: this.token.agreement.beneficiary  });

    for (let task of this.token.taskArray) {
      accounts.push({ owner: task.substring(0,8), address: task });
    }

    let transferDialogRef = this.dialog.open(TransferDialog, {
      width: '400px',
      data: {
        accounts: accounts,
        transfer: {
          address: "",
          amount: 0
        }
      }
    });

    transferDialogRef.afterClosed().subscribe(transfer => {
      if (transfer) {
        this.web3Service.FlexiTimeToken.at(this.token.address).then((factoryInstance) => {
          return factoryInstance.transfer.sendTransaction(
            transfer.address,
            transfer.amount,
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
      }
    });
  }

  onTask() {
    let TaskDialogRef = this.dialog.open(TaskDialog, {
      width: '400px',
      data: { hash: "" }
    });

    TaskDialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.web3Service.FlexiTimeToken.at(this.token.address).then((factoryInstance) => {
          return factoryInstance.createTask.sendTransaction(
            CryptoJS.AES.encrypt(name, localStorage.getItem(this.token.agreement.address)).toString(),
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
      }
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
