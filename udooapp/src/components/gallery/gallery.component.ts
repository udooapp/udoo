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
  animations: string[] = ['back', 'left', 'right', ''];
  leftMargin:number = -1000;
  rightMargin:number = 1000;
  gallery: boolean = false;
  direction: number = 0;
  index: number = 0;
  margin: number = 0;
  slided: boolean = false;
  private found: boolean = false;
  private startCoordX: number = 0;
  @Input() images: any[] = [];
  @Input() editable: boolean = false;
  @Input() loading: number[] = [];
  @Input() error: number[] = [];
  @Output() onClickRemove: EventEmitter<number> = new EventEmitter();
  @Output() onClickImage: EventEmitter<number> = new EventEmitter();
  @Output() onClickNewImage: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngAfterViewChecked(): void {
    let el = document.getElementById("gallery-image-center");
    if (el != null && !this.found) {
      this.found = true;
      let t = this;
      let width:number = document.getElementById("gallery").clientWidth / 2;

      el.addEventListener('animationend', function (e) {
        e.preventDefault();
        t.startCoordX = 0;
        t.margin = 0;
        t.index += t.direction;
        t.animation = '';
        t.animationLeft = '';
        t.animationRight = '';
        t.direction = 0;
        t.leftMargin = -width * 2;
        t.rightMargin = width * 2;
      }, false);
      el.addEventListener('touchstart', function (e) {
        e.preventDefault();
        t.animation = '';
        t.animationLeft = '';
        t.animationRight = '';
        let touch = e.touches[0];
        t.startCoordX = touch.pageX;
        t.slided = false;
        t.leftMargin = -width * 2;
        t.rightMargin = width * 2;
      }, false);
      el.addEventListener('touchend', function (e) {
        e.preventDefault();
        if (width * 2 / 3 > Math.abs(t.margin)) {
          t.animation = t.animations[0];
          if(t.margin < 0) {
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
          t.leftMargin = -width * 2 + t.margin;
          t.rightMargin = width * 2 + t.margin;
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

  @Input() set close(value: number) {
    this.gallery = false;
  }

  public onClickDelete(i: number) {
    this.onClickRemove.emit(i)
  }

  public onClickNew(event) {
    this.onClickNewImage.emit(event);
  }

  public getPictureUrl(image: string) {
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
