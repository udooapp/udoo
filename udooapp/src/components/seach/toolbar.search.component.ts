import {Component, EventEmitter, Input, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {PriceValidator} from "../../validator/price.validator";
import {IValidator} from "../../validator/validator.interface";
import {EmptyValidator} from "../../validator/empty.validator";


@Component({
  selector: 'toolbar-search',
  templateUrl: './toolbar.search.component.html',
  styleUrls: ['./toolbar.search.component.css']
})

export class ToolbarSearchComponent {
  visible: boolean = false;
  animation: string = '';
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  @Input()
  set visibility(value: boolean) {
    this.visible = value;
  }

  onClickClose() {
    this.close.emit(true);
    this.visible = false;
  }

  onKeySearch(event) {
    this.search.emit(event);

  }
}
