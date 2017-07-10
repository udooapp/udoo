import {
  AfterViewChecked, AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit,
  Output
} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {ServiceDialogController} from "./service.window.controller";

declare let $: any;

@Component({
  selector: 'service-dialog',
  templateUrl: './service.window.component.html',
  styleUrls: ['./service.window.component.css']
})

export class ServiceDialogComponent implements AfterViewChecked{
  animations: string[] = ['back', 'left', 'right', ''];
  visible: boolean = false;
  service: any;
  loading: boolean = false;
  direction: string = '';
  startCoordX = 0;
  movedCoordX = 0;
  animation: string = '';
  slided: boolean = false;
  added: boolean = false;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() previous: EventEmitter<any> = new EventEmitter();
  @Output() open: EventEmitter<any> = new EventEmitter();

  ngAfterViewChecked(): void {
    if(!this.added) {
      this.added = true;
      let el = document.getElementById('service-container');
      let t = this;
      if (el != null) {
        let width = document.getElementById('dialog-window').clientWidth * 0.8;
        el.addEventListener('touchstart', function (e) {
          e.preventDefault();
          let touch = e.touches[0];
          t.startCoordX = touch.pageX;

        }, false);
        el.addEventListener('touchend', function (e) {
          e.preventDefault();
          if (t.movedCoordX > 0) {
            t.direction = 'right'
          } else if (t.movedCoordX < 0) {
            t.direction = 'left';
          }
          if (width / 2 > Math.abs(t.movedCoordX)) {
            t.animation = t.animations[0];
            t.movedCoordX = 0;
          } else {
            if (t.direction == 'right') {
              t.animation = t.animations[2];
              if (!t.slided) {
                t.slided = true;
                t.onClickPrevious();
              }
            } else {
              t.animation = t.animations[1];
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
          t.movedCoordX = touch.pageX - t.startCoordX;
        }, false);
      }
    }
  }

  constructor(private controller: ServiceDialogController) {
    controller.setData$.subscribe(value => {
      if (value == null) {
        this.loading = false;
      } else {
        this.added = false;
        this.visible = true;
        this.loading = false;
        this.service = value;
      }
      this.movedCoordX = 0;
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
    }
  }

  @Input() set data(value: any) {
    if (value != null) {
      this.loading = false;
      this.service = value;
      this.visible = true;
    } else {
      this.visible = false;
      this.loading = false;
    }
  }

  @Input() set load(value: boolean) {
    if (value) {
      this.visible = true;
      this.loading = true;
    } else {
      this.loading = false;
    }
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
    this.next.emit(this.service);
  }

  onClickPrevious() {
    this.previous.emit(this.service);
  }

  onClickClose() {
    this.visible = false;
  }

  public convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }
}
