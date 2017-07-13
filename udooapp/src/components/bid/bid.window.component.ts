import {Component, EventEmitter, Input, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {PriceValidator} from "../../validator/price.validator";
import {IValidator} from "../../validator/validator.interface";
import {EmptyValidator} from "../../validator/empty.validator";


@Component({
  selector: 'bid-dialog',
  templateUrl: './bid.window.component.html',
  styleUrls: ['./bid.window.component.css']
})

export class BidDialogComponent {
  visible: boolean = false;
  animation: string = '';
  priceString: string = '';
  validPrice:boolean = false;
  checkPrice:boolean = false;
  @Output() price: EventEmitter<string> = new EventEmitter();
  @Output() description: EventEmitter<string> = new EventEmitter();
  @Output() send: EventEmitter<boolean> = new EventEmitter();
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  validators: IValidator[] = [new EmptyValidator(), new PriceValidator()];
  constructor() {
  }

  @Input() set show(value: boolean) {
    this.visible = value;
  }

  onClickSend() {
    if(this.valid()) {
      this.send.emit(true);
      this.close.emit(true);
      this.visible =  false;
    }
  }

  onClickClose() {
    this.close.emit(true);
    this.visible = false;
  }

  onKeyPrice(event) {
      this.priceString = event;
      if(this.valid()) {
        this.price.emit(event);
      }
  }

  onKeyDescription(event) {
    this.description.emit(event);
  }

  valid(): boolean {
    if(this.validPrice){
      return true;
    } else {
      this.checkPrice =  !this.checkPrice;
      return this.validPrice;
    }
  }
}
