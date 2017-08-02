import {
  AfterViewChecked, Component, EventEmitter, HostListener, Input, Output
} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {ServiceDialogController} from "./service.window.controller";
import {BidService} from "../../services/bid.service";
import {DialogController} from "../../controllers/dialog.controller";
import {GalleryComponent} from "../gallery/gallery.component";
import {NotifierController} from "../../controllers/notify.controller";
import {ServiceDetailComponent} from "../../screens/servicedetail/servicedetail.component";

@Component({
  selector: 'service-dialog',
  templateUrl: './service.window.component.html',
  styleUrls: ['./service.window.component.css'],
  providers: [BidService]
})

export class ServiceDialogComponent implements AfterViewChecked {
  animations: string[] = ['back', 'left', 'right', ''];
  visible: boolean = false;
  service: any;
  user: any;
  image: string = '';
  stars: number[] = [0, 0, 0, 0, 0];
  loading: boolean = false;
  movedCoordX = 0;
  maxHeight: number = 300;
  private startCoordX = 0;
  private scrollDirection = 0;
  private coordStartY: number = 0;
  private coordY: number = 0;
  private slided: boolean = false;
  animation: string = '';
  imageClose: number = 0;
  pictureOpen: number = -1;
  added: boolean = false;
  showBid: boolean = false;
  bid: any = {price: 0, description: '', sid: 0, type: false};
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() previous: EventEmitter<any> = new EventEmitter();
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  ngAfterViewChecked(): void {

    if (!this.added) {
      this.added = true;
      let el = document.getElementById('service-container');
      let t = this;
      if (el != null) {
        let buttonText = document.getElementById('service-dialog-more-button');
        if (buttonText != null) {
          let th = this;
          buttonText.addEventListener('touchend', function (event) {
            th.onClickOpen();
          })
        }
        el.scrollTop = 0;
        let width = document.getElementById('dialog-window').clientWidth * 0.7;
        el.addEventListener('animationend', function (event) {
          t.movedCoordX = 0;
          t.animation = t.animations[3];
        }, false);
        el.addEventListener('touchstart', function (e) {
          e.preventDefault();
          if(t.pictureOpen == -1) {
            t.animation = t.animations[3];
            let touch = e.touches[0];
            t.startCoordX = touch.pageX;
            t.coordY = touch.pageY;
            t.scrollDirection = 0;
          }
        }, false);
        el.addEventListener('touchend', function (e) {
          e.preventDefault();
          if (t.movedCoordX != 0) {
            if (width / 2 > Math.abs(t.movedCoordX)) {
              t.animation = t.animations[0];
            } else {
              if (t.movedCoordX > 0) {
                if (!t.slided) {
                  t.slided = true;
                  t.onClickPrevious();
                }
              } else {
                if (!t.slided) {
                  t.slided = true;
                  t.onClickNext();
                }
              }
            }
          }
        }, false);
        el.addEventListener('touchmove', function (e) {
          e.preventDefault();
          if(t.pictureOpen == -1) {
            let touch = e.touches[0];
            if (t.scrollDirection == 0 || t.scrollDirection == 1) {

              el.scrollTop = el.scrollTop + (-1 * (touch.pageY - t.coordStartY));
              t.coordStartY = touch.pageY;
            }
            if (t.scrollDirection == 0 || t.scrollDirection == -1) {
              t.movedCoordX = touch.pageX - t.startCoordX;
            } else {
              t.movedCoordX = 0;
            }
            if (t.scrollDirection == 0) {
              if (Math.abs(touch.pageY - t.coordY) >= 10) {
                t.scrollDirection = 1;
              } else if (Math.abs(t.movedCoordX) >= 10) {
                t.scrollDirection = -1;
              }
            }
          }
        }, false);
      }
    }
  }

  constructor(private controller: ServiceDialogController, private bidService: BidService, private dialog: DialogController, private notifier: NotifierController) {
    notifier.pageChanged$.subscribe(action => {
      if (action == GalleryComponent.IMAGE) {
        ++this.imageClose;
        this.pictureOpen = -1;
      }
    });
    let t = this;
    this.maxHeight = window.innerHeight - 150;
    window.addEventListener("orientationchange", function () {
      let el = document.getElementById("service-dialog-container");
      if (el != null) {
        t.maxHeight = el.clientHeight - 90;
      }
    });
    window.addEventListener("resize", function () {
      let el = document.getElementById("service-dialog-container");
      if (el != null) {
        t.maxHeight = el.clientHeight - 90;
      }
    });
    controller.setData$.subscribe(value => {
      if (value == null) {
        this.loading = false;
      } else {
        this.added = false;
        this.visible = true;
        this.loading = false;
        this.service = value.service;
        this.user = value.user;
        this.movedCoordX = 0;
        this.bid.type = this.service.oid;
        this.bid.sid = this.bid.type ? this.service.oid : this.service.rid;
        this.bid.price = '';
        this.bid.description = '';
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
      this.startCoordX = 0;
      this.slided = false;
    });

    controller.loading$.subscribe(value => {
      if (value) {
        this.visible = true;
        this.loading = true;

      } else {
        this.loading = false;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  keypress(e: KeyboardEvent) {
    if(this.pictureOpen == -1) {
      switch (e.keyCode) {
        case 27:
          this.onClickClose();
          break;
        case 37:
          this.onClickPrevious();
          break;
        case 39:
          this.onClickNext();
          break;
        case 40:
          let el = document.getElementById('service-container');
          if (el != null) {
            el.scrollTop = el.scrollTop + 10;
          }
          break;
        case 38:
          let ele = document.getElementById('service-container');
          if (ele != null) {
            ele.scrollTop = ele.scrollTop - 10;
          }
          break;
      }
    }
  }

  @Input()
  set data(value: any) {
    if (value != null) {
      this.loading = false;
      this.service = value;
      this.visible = true;
    } else {
      this.visible = false;
      this.loading = false;
    }
  }

  @Input()
  set load(value: boolean) {
    if (value) {
      this.visible = true;
      this.loading = true;
    } else {
      this.loading = false;
    }
  }

  getPictures(): any[] {
    return this.service.picturesOffer ? this.service.picturesOffer : this.service.picturesRequest;
  }

  imageOpen(event) {
    this.pictureOpen = event;
    this.notifier.notify(GalleryComponent.IMAGE)
  }

  isClose() {
    return this.imageClose;
  }

  public getPictureUrl(src: string) {
    if (src == null || src.length == 0 || src === 'null') {
      return './assets/profile_picture.png';
    }
    return this.user.picture;
  }

  getLocation(): string {
    if (this.service.location != null && this.service.location != '' && JSON.parse(this.service.location).address) {
      return JSON.parse(this.service.location).address
    } else {
      return '';
    }
  }

  onClickOpen() {
    this.open.emit(this.service);
  }

  onClickNext() {
    this.animation = this.animations[1];
    this.next.emit(this.service);
  }

  onClickPrevious() {
    this.animation = this.animations[2];
    this.previous.emit(this.service);
  }

  onClickClose() {
    this.visible = false;
    this.close.emit(true);
  }

  onClickBidClose() {
    this.showBid = false;
    this.visible = true;
  }

  onClickSendOffer() {
    this.visible = false;
    this.showBid = true;
  }

  onClickSend() {
    this.bidService.savePid(this.bid).subscribe(
      data => {
        this.dialog.sendMessage("Bid sent!");
      },
      error => {
        this.dialog.notifyError(error);
      });
  }

  onKeyPrice(event) {
    this.bid.price = event;
  }

  onKeyDescription(event) {
    this.bid.description = event;
  }

  public convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }
}
