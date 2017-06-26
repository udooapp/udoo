import {Component, NgZone, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../../entity/user';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {OfferService} from "../../services/offer.service";
import {RequestService} from "../../services/request.service";
import {ContactService} from "../../services/contact.service";
import {UserService} from "../../services/user.service";
import {NotifierController} from "../../controllers/notify.controller";
import {MAP} from "../../app/app.routing.module";
import {DialogController} from "../../controllers/dialog.controller";

@Component({
  templateUrl: './servicedeteail.component.html',
  styleUrls: ['./servicedetail.component.css'],
  providers: [OfferService, RequestService, UserService, ContactService]
})
export class ServiceDetailComponent implements OnInit {
  private static NAME: string = 'ServiceDetail';
  message: string = '';
  user = new User(null, '', '', '', '', '', 0, -1, '', 'en', 0);
  error: string = '';
  type: boolean = false;
  data: any;
  loaded: boolean = false;
  stars: number[] = [0, 0, 0, 0, 0];
  image: string;
  added: boolean = false;

  constructor(private zone: NgZone, private offerService: OfferService, private requestService: RequestService, private router: Router, private notifier: NotifierController, private userService: UserService, private route: ActivatedRoute, private  contactServiece: ContactService, private dialog: DialogController) {
    this.image = this.getPictureUrl('');
    notifier.pageChanged$.subscribe(action => {
      if (action == ServiceDetailComponent.NAME) {
        this.router.navigate([MAP]);
      }
    })
    this.notifier.notify(ServiceDetailComponent.NAME);
    dialog.errorResponse$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  private processOutsideOfAngularZone(id: number) {
    this.zone.run(() => {
      if (this.type) {
        this.offerService.getOffer(id).subscribe(
          data => {
            this.data = data;
            this.loaded = true;
            this.loadUser();
          },
          error => this.error = <any>error
        );
      } else {
        this.requestService.getRequest(id).subscribe(
          data => {
            this.data = data;
            this.loaded = true;
            this.loadUser();
          },
          error => this.error = <any>error
        );
      }
    });
  }

  ngOnInit() {
    let id: number = -1;
    this.route.params
      .subscribe((params: Params) => {

        id = +params['id'];
        this.type = (+params['type'] === 1);
        if (id > -1) {
          this.processOutsideOfAngularZone(id);
        } else {
          this.error = 'Invalid parameter'
        }
      });
  }

  private loadUser() {
    this.userService.getUserInfo(this.data.uid).subscribe(
      data => {
        this.loaded = true;
        this.user = data;
        this.image = this.getPictureUrl(this.user.picture);
        let star = this.user.stars;
        if (star == 0) {
          this.stars = [2, 2, 2, 2, 2];
        } else {
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
        }
      },
      error => {
        this.error = <any>error;
        this.dialog.notifyError(this.error);
      }
    );
  }

  public getPictureUrl(src: string) {
    if (src == null || src.length == 0 || src === 'null') {
      return './assets/profile_picture.png';
    }
    return this.user.picture;
  }

  public getLocation(location: string): string {
    if (location.length == 0) {
      return ''
    }
    return JSON.parse(location).address;
  }

  public convertNumberToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

  public onClickAddToContact() {
    if (!this.added) {
      this.contactServiece.addContact(this.data.uid).subscribe(
        message => {
          this.message = message;
          this.error = '';
          this.added = true;
        },
        error => {
          this.error = <any>error;
          this.message = '';
        }
      )
    }
  }
}
