import {Component, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {OfferService} from "../services/offer.service";
import {RequestService} from "../services/request.service";
import {UserService} from "../services/user.service";

@Component({
  templateUrl: './servicedeteail.component.html',
  styleUrls: ['./servicedetail.component.css'],
  providers: [OfferService, RequestService, UserService]
})
export class ServiceDetailComponent implements OnInit {
  message: String;
  user = new User(null, '', '', '', '', '', 0, -1, '');
  error: string = '';
  type: boolean = false;
  data: any;
  loaded: boolean = false;

  constructor(private router: Router, private offerService: OfferService, private requestService: RequestService, private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let id: number = -1;
    this.route.params
      .subscribe((params: Params) => {
        id = +params['id'];
        this.type = (+params['type'] === 1);
        if (id > -1) {
          if (this.type) {
            this.offerService.getOffer(id).subscribe(
              data => {
                this.loaded = true;
                this.data = data;
              },
              error => this.error = <any>error
            );
          } else {
            this.requestService.getRequest(id).subscribe(
              data => {
                this.loaded = true;
                this.data = data;
              },
              error => this.error = <any>error
            );
          }
        } else {
          this.error = 'Invalid parameter'
        }
      });
  }

  convertNumberToDate(millis : number): string{
    let date : Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0'+ date.getMonth())+ '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }
  onBackPressed() {
    this.router.navigate(['/map']);
  }
}
