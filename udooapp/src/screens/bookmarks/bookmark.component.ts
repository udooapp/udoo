import {Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {ChatService} from "../../services/chat.service";
import {Router} from "@angular/router";
import {UserController} from "../../controllers/user.controller";
import {MainComponent} from "../main/main.component";
import {ROUTES} from "../../app/app.routing";
import {BookmarkService} from "../../services/bookmark.service";
import {ServiceDialogController} from "../../components/service/service.window.controller";
import {OfferService} from "../../services/offer.service";
import {RequestService} from "../../services/request.service";
import {BidService} from "../../services/bid.service";

@Component({
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css'],
  providers: [ChatService, BookmarkService, OfferService, RequestService, BidService]
})
export class BookmarkComponent implements OnInit {

  public data: any = [];
  public error: string;
  public message: string = '';
  public loading: boolean = false;
  public noMore: boolean = false;
  public blur: boolean = false;

  //BidDialog
  public showBid: boolean = false;
  private bid: any = {price: 0, description: '', sid: 0, type: false};

  constructor(private bidService: BidService, private offerService: OfferService, private  requestService: RequestService, private serviceDialogController: ServiceDialogController, private bookmarkService: BookmarkService, private userController: UserController, private dialog: DialogController, private notifier: NotifierController, private router: Router) {
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    notifier.userScrolledToTheBottom$.subscribe(() => {
      this.userScrollDown();
    });
  }

  private userScrollDown() {
    if (!this.loading && !this.noMore) {
      this.loading = true;
      this.bookmarkService.get(this.data.length).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          if (data.length < MainComponent.PAGE_SIZE) {
            this.noMore = true;
          }
          this.loading = false;
        },
        error => {
          this.error = <any>error;
          this.dialog.notifyError(this.error);
          this.loading = false;
        });
    }
  }

  public ngOnInit() {
    this.loading = true;
    this.bookmarkService.get(0).subscribe(
      data => {
        this.loading = false;
        this.data = data;
        if (data.length < MainComponent.PAGE_SIZE) {
          this.noMore = true;
        }
      },
      error => {
        this.loading = false;
        this.error = <any>error;
        this.dialog.notifyError(this.error)
      });
  }

  public onClickBookmark(item) {
    this.loadDialog(item.type, item.sid);
  }

  public getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return './assets/profile_picture.png';
    }
    return url;
  }

  public onClickOpen(element: any) {
    let type: boolean = element.rid;
    this.router.navigate([ROUTES.DETAIL + (type ? element.rid : element.oid) + '/' + (type ? 0 : 1) + '/' + 0]);
  }

  public onClickNext(value: any) {
    let type: boolean = !value.rid;
    let index = this.getElementIndex(!type ? value.rid : value.oid, type, true);
    if (index >= 0) {
      this.loadDialog(this.data[index].type, this.data[index].sid);
    } else {
      this.serviceDialogController.setData$.emit(null);
    }
  }

  public onClickPrevious(value: any) {
    let type: boolean = !value.rid;
    let index = this.getElementIndex(!type ? value.rid : value.oid, type, false);
    if (index >= 0) {
      this.loadDialog(this.data[index].type, this.data[index].sid);
    } else {
      this.serviceDialogController.setData$.emit(null);
    }
  }

  private loadDialog(type: boolean, id: number) {
    this.serviceDialogController.loading$.emit(true);
    if (type) {
      this.offerService.getOfferDialogData(id).subscribe(
        value => {
          this.blur = true;
          this.serviceDialogController.setData$.emit({
            service: value.offer,
            user: value.user,
            bookmark: value.bookmark
          });
        },
        error => {
          this.blur = false;
          this.serviceDialogController.setData$.emit(null);
          this.dialog.notifyError(error)
        }
      );
    } else {
      this.requestService.getRequestDialogData(id).subscribe(
        value => {
          this.blur = true;
          this.serviceDialogController.setData$.emit({
            service: value.request,
            user: value.user,
            bookmark: value.bookmark
          });
        },
        error => {
          this.blur = false;
          this.serviceDialogController.setData$.emit(null);
          this.dialog.notifyError(error)
        }
      );
    }
  }

  public getElementIndex(id: number, type: boolean, greater: boolean) {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i].sid == id && this.data[i].type == type) {
        if (greater) {
          ++i;
        } else {
          --i;
        }
        if (i < 0) {
          ++i;
        } else if (i == this.data.length) {
          --i;
        }
        return i;
      }
    }
    return -1;
  }

  public onClickClose() {
    this.blur = false;
  }

  onClickServiceDialogSendBid(event) {
    this.onBidClickSendOffer(event.oid, event.oid ? event.oid : event.rid)
  }

  onBidClickSendOffer(type: boolean, id: number) {
    this.showBid = true;
    this.bid.type = type;
    this.bid.sid = id;
    this.bid.price = '';
    this.bid.description = '';

  }
  onBidClickClose() {
    this.showBid = false;
  }
  onBidClickSend() {
    this.bidService.savePid(this.bid).subscribe(
      data => {
        this.dialog.sendMessage("Your offer was sent!");
      },
      error => {
        this.dialog.sendError(error.msg);
      });
  }

  onBidKeyPrice(event) {
    this.bid.price = event;
  }

  onBidKeyDescription(event) {
    this.bid.description = event;
  }
}

