import {AfterViewChecked, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent implements AfterViewChecked {

  public static IMAGE: string = "GALLERY_IMAGE";

  message: string = '';
  animation: string = '';
  animationLeft: string = '';
  animationRight: string = '';
  private animations: string[] = ['back', 'left', 'right', ''];
  leftMargin: number = -1000;
  rightMargin: number = 1000;
  gallery: boolean = false;
  private direction: number = 0;
  index: number = 0;
  margin: number = 0;
  private width: number = 0;
  private slided: boolean = false;
  private found: boolean = false;
  private startCoordX: number = 0;
  private clicked: boolean = false;
  private imageElements: any[] = [];
  @Input() smallPictures: boolean = false;
  @Input() images: any[] = [];
  @Input() editable: boolean = false;
  @Input() loading: number[] = [];
  @Input() error: number[] = [];
  @Output() onClickRemove: EventEmitter<number> = new EventEmitter();
  @Output() onClickImage: EventEmitter<number> = new EventEmitter();
  @Output() onClickNewImage: EventEmitter<any> = new EventEmitter();

  constructor() {
    let t = this;
    t.leftMargin = -window.innerWidth;
    t.rightMargin = window.innerWidth;
    t.width = window.innerWidth;
    window.addEventListener("orientationchange", function () {

      let el = document.getElementById("gallery");
      if (el != null) {
        t.width = el.clientWidth / 2;
      }
    });
    window.addEventListener("resize", function () {
      t.leftMargin = 1000;
      t.rightMargin = 1000;
      let el = document.getElementById("gallery");
      if (el != null) {
        t.width = el.clientWidth / 2;
        t.leftMargin = -t.width * 2;
        t.rightMargin = t.width * 2;
      }
    });
  }

  ngAfterViewChecked(): void {
    let el = document.getElementById("gallery-image-center");
    if (el != null && !this.found) {
      this.found = true;
      let t = this;
      el.addEventListener('animationend', function (e) {
        e.preventDefault();
        t.startCoordX = 0;
        t.margin = 0;
        t.index += t.direction;
        t.animation = '';
        t.animationLeft = '';
        t.animationRight = '';
        t.direction = 0;
        if (t.slided) {
          t.leftMargin = -t.width * 2;
          t.rightMargin = t.width * 2;
        }
      }, false);
      el.addEventListener('touchstart', function (e) {
        e.preventDefault();
        t.animation = '';
        t.animationLeft = '';
        t.animationRight = '';
        let touch = e.touches[0];
        t.startCoordX = touch.pageX;
        t.slided = false;
        t.leftMargin = -t.width * 2;
        t.rightMargin = t.width * 2;
      }, false);
      el.addEventListener('touchend', function (e) {
        e.preventDefault();
        if (t.width * 2 / 3 > Math.abs(t.margin)) {
          t.animation = t.animations[0];
          if (t.margin < 0) {
            t.animationRight = t.animations[2];
            t.animationLeft = '';
          } else {
            t.animationRight = '';
            t.animationLeft = t.animations[1];
          }
        } else {
          if (t.margin > 0) {
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
      }, false);
      el.addEventListener('touchmove', function (e) {
        e.preventDefault();
        let touch = e.touches[0];

        if ((touch.pageX - t.startCoordX < 0 && t.index == 0) || (touch.pageX - t.startCoordX > 0 && t.index == t.images.length - 1) || (t.index > 0 && t.index < t.images.length - 1)) {
          t.margin = touch.pageX - t.startCoordX;
          t.leftMargin = -t.width * 2 + t.margin;
          t.rightMargin = t.width * 2 + t.margin;
        }
      }, false)
    }
  }

  @HostListener('document:keydown', ['$event'])
  keypress(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37:
        this.onClickPrevious();
        break;
      case 39:
        this.onClickNext();
        break;
    }
  }

  @Input()
  set close(value: number) {
    this.gallery = false;
    this.found = false;
  }

  public onClickDelete(i: number) {
    this.onClickRemove.emit(i)
  }

  public onClickNew(event) {
    this.onClickNewImage.emit(event);
  }

  public getPictureUrl(image: string, i: number) {
    if (this.imageElements.length <= i || this.imageElements[i] == null) {
      let el = document.getElementById('galleryTouch' + i);
      let t = this;
      if (el != null) {
        this.imageElements.push(el);
        let coord = {x: 0, y: 0};
        el.addEventListener('touchstart', function (e) {
          e.preventDefault();
          coord.x = 0;
          coord.y = 0;
          t.clicked = false;
        });
        el.addEventListener('touchmove', function (e) {
          e.preventDefault();
          ++coord.x;
          ++coord.y;
        });
        el.addEventListener('touchend', function (e) {
          e.preventDefault();
          if (!t.clicked && coord.x < 10 && coord.y < 10) {
            t.clicked = true;
            t.onClickPicture(i);
          }
        });
      }
    }
    if (image == null || image.length == 0 || image === 'null') {
      return '';
    }
    return image;
  }

  public onClickPicture(i: number) {
    this.gallery = true;
    this.index = i;
    this.onClickImage.emit(i);
  }

  public onClickPrevious() {
    if (this.index > 0) {
      this.direction = -1;
      this.animationRight = '';
      this.animation = this.animations[2];
      this.animationLeft = this.animations[0];
    }
  }

  public onClickNext() {
    if (this.index < this.images.length - 1) {
      this.direction = 1;
      this.animation = this.animations[1];
      this.animationRight = this.animations[0];
      this.animationLeft = '';
    }
  }

  isLoading(index: number): boolean {
    for (let i = 0; i < this.loading.length; ++i) {
      if (this.loading[i] === index) {
        return true;
      }
    }
    return false;
  }

  isError(index: number): boolean {
    for (let i = 0; i < this.error.length; ++i) {
      if (this.error[i] === index) {
        return true;
      }
    }
    return false;
  }
}
