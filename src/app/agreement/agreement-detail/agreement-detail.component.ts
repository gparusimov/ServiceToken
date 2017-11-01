import { Component, Input, Output, Inject, EventEmitter } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MatList, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Web3Service } from "../../web3/web3.service";
import { Agreement } from "../agreement";

@Component({
  selector: 'app-agreement-detail',
  templateUrl: './agreement-detail.component.html',
  styleUrls: ['./agreement-detail.component.css']
})
export class AgreementDetailComponent {

  @Input() private agreement: Agreement;
  @Input() private account: string;

  @Output() onSubmitted = new EventEmitter<null>();

  constructor(
    private web3Service : Web3Service,
    public dialog: MatDialog,
    private router: Router
  ) { }

  onSubmit() {
    this.onSubmitted.emit();
  }
}
