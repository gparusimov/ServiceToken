import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { AccountComponent } from "../../account/account.component";
import { Web3Service } from "../../web3/web3.service";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Task, States } from "../task";
import { Token } from "../../token/token";
import { Agreement } from "../../agreement/agreement";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent extends AccountComponent {

  private task: Task;
  private filter: any;

  constructor(
    web3Service : Web3Service,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(web3Service);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.filter.stopWatching((error, result) => {
      if (error == null) {
        console.log("stopped watching");
      }
    });
  }

  web3OnAccount() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getTask(params.get('address')))
    .subscribe(task => {
      this.task = task;
      this.watchStateChanges();
    });
  }

  getTask(address: string): Promise<Task> {
    return new Promise((resolve) => {
      resolve(this.web3Service.task(address));
    }).then((task: Task) => {
      return new Promise((resolve) => {
        this.web3Service.ServiceToken.at(task.token.address).balanceOf.call(address).then((balance) => {
          task.balance = balance;
          resolve(task);
        }).catch(function (e) {
          console.log(e);
        });
      })
    });
  }

  watchStateChanges() {
    this.web3Service.ServiceTask.at(this.task.address).then ((taskInstance) => {
      return taskInstance.StateChange({fromBlock: "latest"});
    }).then ((stateChanges) => {
      stateChanges.watch((error, result) => {
        if (error == null) {
          console.log(result.args);
          this.snackBar.open("State changed.", "Dismiss", { duration: 2000 });
          this.getTask(this.task.address).then((task) => {
            this.task = task;
          });
        }
      });
      this.filter = stateChanges;
    });
  }

  onSettle() {
    this.web3Service.ServiceTask.at(this.task.address).then((factoryInstance) => {
      return factoryInstance.settle.sendTransaction(
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

  onRefund() {
    this.web3Service.ServiceTask.at(this.task.address).then((factoryInstance) => {
      return factoryInstance.refund.sendTransaction(
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

  goBack(): void {
    this.location.back();
  }
}
