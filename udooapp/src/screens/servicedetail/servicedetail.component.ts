import {Component, NgZone, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../../entity/user';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {OfferService} from "../../services/offer.service";
import {RequestService} from "../../services/request.service";
import {ContactService} from "../../services/contact.service";
import {UserService} from "../../services/user.service";
import {NotifierController} from "../../controllers/notify.controller";
import {MAP, USER_BIDS} from "../../app/app.routing.module";
import {DialogController} from "../../controllers/dialog.controller";
import {GalleryComponent} from "../../components/gallery/gallery.component";
import {CommentService} from "../../services/comment.service";
import {BidService} from "../../services/bid.service";

@Component({
  templateUrl: './servicedeteail.component.html',
  styleUrls: ['./servicedetail.component.css'],
  providers: [OfferService, RequestService, UserService, ContactService, CommentService, BidService]
})
export class ServiceDetailComponent implements OnInit {
  private static NAME: string = 'ServiceDetail';
  message: string = '';
  user = new User(null, '', '', '', '', '', 0, -1, '', 'en', 0, 0);
  bid: any = {price: 0, description: '', sid: 0, type: false};
  commentMessage = '';
  showBid = false;
  error: string = '';
  type: boolean = false;
  data: any;
  loaded: boolean = false;
  stars: number[] = [0, 0, 0, 0, 0];
  image: string;
  added: boolean = false;
  pictures: any[] = [];
  open: number = -1;
  imageClose: number = 0;
  comments: any[];
  clearArea: boolean = false;
  hasMore: boolean = true;
  page: number = 0;

  constructor(private zone: NgZone, private bidService: BidService, private offerService: OfferService, private commentService: CommentService, private requestService: RequestService, private router: Router, private notifier: NotifierController, private route: ActivatedRoute, private  contactService: ContactService, private dialog: DialogController) {
    this.image = this.getPictureUrl('');
    notifier.pageChanged$.subscribe(action => {
      if (action == ServiceDetailComponent.NAME) {
        switch (this.page) {
          case 0:
            this.router.navigate([MAP]);
            break;
          case 1:
            this.router.navigate([USER_BIDS]);
            break;
        }
      } else if (action == GalleryComponent.IMAGE) {
        ++this.imageClose;
        this.open = -1;
      }
    });
    this.notifier.notify(ServiceDetailComponent.NAME);
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  private processOutsideOfAngularZone(id: number) {
    this.zone.run(() => {
      if (this.type) {
        this.offerService.getOfferData(id).subscribe(
          data => {
            this.data = data.offer;
            this.loaded = true;
            this.bid.sid = this.data.oid;
            this.bid.type = true;
            this.pictures = this.data.picturesOffer;
            let t: any[] = data.comments;
            let i: number = t.length - 1;
            this.comments = [];
            for (; i >= 0; --i) {
              this.comments.push(t[i])
            }
            this.hasMore = this.comments.length % 5 == 0 && this.comments.length > 0;
            this.loadUser(data.user);
          },
          error => this.error = <any>error
        );
      } else {
        this.requestService.getRequestData(id).subscribe(
          data => {
            this.data = data.request;
            this.pictures = this.data.picturesRequest;
            this.bid.sid = this.data.rid;
            this.bid.type = false;
            this.loaded = true;
            this.loadUser(data.user);
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
        this.page = +params['page'];
        this.type = (+params['type'] === 1);
        if (id > -1) {
          this.processOutsideOfAngularZone(id);
        } else {
          this.error = 'Invalid parameter'
        }
      });
  }

  private loadUser(user: User) {
    this.loaded = true;
    this.user = user;
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
  }

  public getPictures(): any[] {
    return this.pictures;
  }

  public getPictureUrl(src: string) {
    if (src == null || src.length == 0 || src === 'null') {
      return './assets/profile_picture.png';
    }
    return this.user.picture;
  }

  public getServiceLocation(location: string): string {
    if (location.length == 0) {
      return ''
    }
    return JSON.parse(location).address;
  }

  public convertNumberToDateTime(millis: number): string {
    let date: Date = new Date(millis);
    let t: string[] = date.toDateString().split(" ");
    return date.getFullYear() + ' ' + t[1] + ' ' + t[2] + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  }

  public convertNumberToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '.' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '.' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

  public onClickAddToContact() {
    if (!this.added) {
      this.contactService.addContact(this.data.uid).subscribe(
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

  public imageOpen(event) {
    this.open = event;
    this.notifier.notify(GalleryComponent.IMAGE)
  }

  public isClose(): number {
    return this.imageClose;
  }

  public sendComment() {
    this.commentService.saveComment({
      uid: this.user.uid,
      type: this.type,
      sid: this.type ? this.data.oid : this.data.rid,
      comment: this.commentMessage
    }).subscribe(
      data => {
        this.clearArea = !this.clearArea;
        if (this.comments.length % 5 > 0 || this.comments.length == 0) {
          this.comments.push(data);

        } else {
          this.hasMore = true;
        }
      },
      error => {
        this.dialog.notifyError(error);
      }
    );
  }

  public showMoreComments() {
    this.commentService.getComments(this.type ? this.data.oid : this.data.rid, this.comments.length, this.type).subscribe(
      result => {
        this.hasMore = result.length % 5 == 0 && result.length > 0;
        let i: number = result.length - 1;
        let res: any[] = [];
        for (; i >= 0; --i) {
          res.push(result[i]);
        }
        for (i = 0; i < this.comments.length; ++i) {
          res.push(this.comments[i]);
        }
        this.comments = res;
      },
      error => {
        this.dialog.notifyError(error)
      }
    );
  }

  public onClickClose() {
    this.showBid = false;
  }

  public onClickSend() {
    this.bidService.savePid(this.bid).subscribe(
      data => {
        this.dialog.sendMessage("Bid sent!");
      },
      error => {
        this.dialog.notifyError(error);
      });
  }

  public onClickBid(): void {
    this.showBid = true;
  }

  onKeyPrice(event) {
    this.bid.price = event;
  }

  onKeyDescription(event) {
    this.bid.description = event;
  }
}
