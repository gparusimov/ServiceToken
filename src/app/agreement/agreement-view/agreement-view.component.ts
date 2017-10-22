import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-agreement-view',
  templateUrl: './agreement-view.component.html',
  styleUrls: ['./agreement-view.component.css']
})

export class AgreementViewComponent implements OnInit {

  public agreement: string;

  constructor(private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.getAgreement(params.get('address')))
    .subscribe(address => this.agreement = address);
  }

  getAgreement(address: string) {
    return [address];
  }

  goBack(): void {
    this.location.back();
  }
}
