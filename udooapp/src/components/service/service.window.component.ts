import {
  AfterViewChecked, Component, EventEmitter, HostListener, Input, Output
} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {ServiceDialogController} from "./service.window.controller";
import {DialogController} from "../../controllers/dialog.controller";
import {GalleryComponent} from "../gallery/gallery.component";
import {NotifierController} from "../../controllers/notify.controller";
import {ContactService} from "../../services/contact.service";
import {BookmarkService} from "../../services/bookmark.service";
import {Router} from "@angular/router";

@Component({
  selector: 'service-dialog',
  templateUrl: './service.window.component.html',
  styleUrls: ['./service.window.component.css'],
  providers: [ContactService, BookmarkService]
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
  scrollTop: number = 0;

  private isScroll: boolean = false;
  private startCoordX = 0;
  private scrollDirection = 0;
  private coordStartY: number = 0;
  private coordY: number = 0;
  private slided: boolean = false;

  public animation: string = '';
  public imageClose: number = 0;
  public pictureOpen: number = -1;
  public added: boolean = false;
  public contactAdded: boolean = false;
  public showBid: boolean = false;
  public addedToBookmark: boolean = false;
  public backgroundBlur: boolean = false;

  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() previous: EventEmitter<any> = new EventEmitter();
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<number> = new EventEmitter();
  @Output() sendOffer: EventEmitter<any> = new EventEmitter();
  @Output() onClickMessage: EventEmitter<number> = new EventEmitter();
  @Output() onClickPhone: EventEmitter<number> = new EventEmitter();
  @Input() disableKeyboard: boolean = false;

  public ngAfterViewChecked(): void {

    if (!this.added) {
      this.added = true;
      let el = document.getElementById('service-container');
      let t = this;
      if (el != null) {
        let closeBtn = document.getElementById('service-dialog-close-button');
        if (closeBtn != null) {
          closeBtn.addEventListener('touchend', function (event) {
            if (t.movedCoordX == 0) {
              t.onClickClose();
            }
          });
        }
        let buttonMore = document.getElementById('service-dialog-more-button');
        if (buttonMore != null) {
          buttonMore.addEventListener('touchend', function (event) {
            t.onClickOpen();
          })
        }
        let buttonContact = document.getElementById('service-dialog-add-to-contact');
        if (buttonContact != null) {
          buttonContact.addEventListener('touchend', function (event) {
            if(!t.isScroll) {
              t.onClickAddToContact();
            } else {
              t.isScroll = false;
            }
          })
        }
        let buttonMessage = document.getElementById('service-dialog-send-message');
        if (buttonMessage != null) {
          buttonMessage.addEventListener('touchend', function (event) {
            if(!t.isScroll) {
              t.onClickMessageButton();
            } else {
              t.isScroll = false;
            }
          })
        }
        let buttonCall = document.getElementById('service-dialog-call');
        if (buttonCall != null) {
          buttonCall.addEventListener('touchend', function (event) {
            if(!t.isScroll) {
              window.open('tel:' + t.user.phone, "_self");
            } else {
              t.isScroll = false;
            }
          })
        }
        el.scrollTop = 0;
        let width = document.getElementById('dialog-window').clientWidth * 0.7;
        el.addEventListener('animationend', function (event) {
          t.movedCoordX = 0;
          t.animation = t.animations[3];
        }, false);
        el.addEventListener('touchstart', e => {
          e.preventDefault();
          if (t.pictureOpen == -1) {
            t.animation = t.animations[3];
            let touch = e.touches[0];
            t.startCoordX = touch.pageX;
            t.coordY = touch.pageY;
            t.coordStartY = t.coordY;
            t.scrollDirection = 0;
            t.isScroll = false;
          }
        }, false);
        el.addEventListener('touchend', e => {
          e.preventDefault();
          t.scrollDirection = 0;
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
        el.addEventListener('touchmove', e => {
          e.preventDefault();
          if (t.pictureOpen == -1) {
            t.isScroll = true;
            let touch = e.touches[0];
            if (t.scrollDirection == 0) {
              if (Math.abs(touch.pageY - t.coordY) >= 15) {
                t.scrollDirection = 1;
              } else if (Math.abs(touch.pageX - t.startCoordX) >= 15) {
                t.scrollDirection = -1;
              }
            } else {
              if (t.scrollDirection == 1) {
                el.scrollTop = el.scrollTop - (touch.pageY - t.coordStartY);
                t.coordStartY = touch.pageY;
              }
              if (t.scrollDirection == -1) {
                t.movedCoordX = touch.pageX - t.startCoordX;
              } else {
                t.movedCoordX = 0;
              }
            }
          }
        }, false);
      }
    }

  }

  constructor(private bookmakrService: BookmarkService, private controller: ServiceDialogController, private dialog: DialogController, private notifier: NotifierController, private contactService: ContactService) {
    notifier.pageChanged$.subscribe(action => {
      if (action == GalleryComponent.IMAGE) {
        ++this.imageClose;
        this.backgroundBlur = false;
        this.pictureOpen = -1;
      }
    });
    let t = this;
    this.maxHeight = document.getElementById('content-container').clientHeight - 95;
    window.addEventListener("orientationchange", () => {
      t.maxHeight = document.getElementById('content-container').clientHeight - 95;
      t.containerScroll();
    });
    window.addEventListener("resize", () => {
      t.containerScroll();
      t.maxHeight = document.getElementById('content-container').clientHeight - 95;
    });
    controller.setData$.subscribe(value => {
      this.scrollTop = 0;
      this.contactAdded = false;
      if (value == null) {
        this.loading = false;
      } else {
        this.added = false;
        this.visible = true;
        this.loading = false;
        this.service = value.service;
        this.user = value.user;
        this.addedToBookmark = value.bookmark;
        this.movedCoordX = 0;
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
    if (!this.disableKeyboard) {
      if (this.pictureOpen == -1) {
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
  }

  @Input()
  public set data(value: any) {
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
  public set closeDialog(value){
    this.onClickClose();
  }

  @Input()
  public set load(value: boolean) {
    if (value) {
      this.visible = true;
      this.loading = true;
    } else {
      this.loading = false;
    }
  }
  public onClickMessageButton(){
    this.onClickMessage.emit(this.user.uid);
  }

  public getPictures(): any[] {

    return this.service.picturesOffer ? this.service.picturesOffer : this.service.picturesRequest;
  }

  public imageOpen(event) {
    this.backgroundBlur = true;
    this.pictureOpen = event;
    this.notifier.notify(GalleryComponent.IMAGE)
  }

  public onClickCloseFullscreenGallery() {
    this.notifier.pageChanged$.emit(' ');
    ++this.imageClose;
    this.backgroundBlur = false;
    this.pictureOpen = -1;
  }

  public isClose() {
    return this.imageClose;
  }

  public getPictureUrl(src: string) {
    if (src == null || src.length == 0 || src === 'null') {
      return './assets/profile_picture.png';
    }
    return this.user.picture;
  }

  public getLocation(): string {
    if (this.service.location != null && this.service.location != '' && JSON.parse(this.service.location).address) {
      return JSON.parse(this.service.location).address
    } else {
      return '';
    }
  }

  public onClickSendOffer() {
    this.sendOffer.emit(this.service);
  }

  public onClickBookmark() {
    let type: boolean = !this.service.rid;
    this.bookmakrService.save(type ? this.service.oid : this.service.rid, type).subscribe(
      () => {
        this.addedToBookmark = !this.addedToBookmark;
      },
      error => {
        this.dialog.sendError(error);
      }
    );
  }

  public onClickOpen() {
    this.open.emit(this.service);
  }

  public onClickNext() {
    this.animation = this.animations[1];
    this.next.emit(this.service);
  }

  public onClickPrevious() {
    this.animation = this.animations[2];
    this.previous.emit(this.service);
  }

  public onClickClose() {
    if (this.visible) {
      this.visible = false;
      this.close.emit(true);
      this.scroll.emit(0);
    }
  }


  public containerScroll() {
    let e: HTMLElement = document.getElementById("service-container");
    if (e != null) {
      this.scrollTop = e.scrollTop;
      if (this.scrollTop > 50) {
        this.scrollTop = 50;
      } else if (this.scrollTop < 25) {
        this.scrollTop = 0;
      }
      this.scroll.emit(this.scrollTop);
    }
  }

  public onClickAddToContact() {
    if (!this.contactAdded) {
      this.contactService.addContact(this.user.uid).subscribe(
        message => {
          this.dialog.sendMessage(message);
          this.contactAdded = true;
        },
        error => {
          this.dialog.sendMessage(error);
        }
      )
    }
  }

  public convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }
}
