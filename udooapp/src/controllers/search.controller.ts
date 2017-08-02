import {EventEmitter} from "@angular/core";

export class SearchController {

  public static SEARCH_HIDE = false;
  public static SEARCH_SHOW= true;

  public onChangeSearchButtonVisibility$: EventEmitter<boolean>;
  public onClickSearchButton$: EventEmitter<boolean>;


  constructor() {
    this.onChangeSearchButtonVisibility$ = new EventEmitter();
    this.onClickSearchButton$= new EventEmitter();
  }
}
