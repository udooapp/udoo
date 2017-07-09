import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {ServiceDialogController} from "./service.window.controller";

@Component({
  selector: 'service-dialog',
  templateUrl: './service.window.component.html',
  styleUrls: ['./service.window.component.css']
})

export class ServiceDialogComponent {
  visible: boolean = false;
  service: any;
  loading: boolean = false;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() previous: EventEmitter<any> = new EventEmitter();
  @Output() open: EventEmitter<any> = new EventEmitter();

  constructor(private controller: ServiceDialogController) {
    controller.setData$.subscribe(value => {
      if (value != null) {
        this.visible = true;
        this.loading = false;
        this.service = value;
      } else {
        this.visible = false;
        this.loading = false;
      }
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
    switch (e.keyCode){
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
