import {Component, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {OfferService} from "../services/offer.service";
import {RequestService} from "../services/request.service";
import {UserService} from "../services/user.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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
  stars: number[] = [0, 0, 0, 0, 0];
  image: SafeUrl;
  constructor(private router: Router, private offerService: OfferService, private requestService: RequestService, private userService: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.image = this.getPictureUrl('');
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

                this.data = data;
                this.loadUser();
              },
              error => this.error = <any>error
            );
          } else {
            this.requestService.getRequest(id).subscribe(
              data => {
                this.data = data;
                this.loadUser();
              },
              error => this.error = <any>error
            );
          }
        } else {
          this.error = 'Invalid parameter'
        }
      });
  }
  loadUser(){
    this.userService.getUserInfo(this.data.uid).subscribe(
      data => {
        this.loaded = true;
        this.user= data;
        this.image = this.getPictureUrl(this.user.picture);
        let star = this.user.stars;
        for (let i = 0; i < 5; ++i) {
          if (star >= 1) {
            this.stars[i] = 2;
          } else if (star > 0) {
            this.stars[i] = 1;
          } else {
            this.stars[i] = 0;
          }
          star -= 1;
        }
      },
      error => this.error = <any>error
    );
  }

  getPictureUrl(src : string) {
    if(src == null || src.length == 0 || src === 'null'){
      return './assets/profile_picture.png';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + this.user.picture);
  }

  getLocation(location : string): string{
    return JSON.parse(location).address;
  }
  convertNumberToDate(millis : number): string{
    let date : Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0'+ date.getMonth())+ '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }
  onBackPressed() {
    this.router.navigate(['/map']);
  }
  onClickAddToCOntact(){

  }
}
