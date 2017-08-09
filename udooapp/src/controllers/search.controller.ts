import {EventEmitter} from "@angular/core";

export class SearchController {

  public static SEARCH_HIDE = false;
  public static SEARCH_SHOW = true;

  public onKeySearchText$: EventEmitter<string>;
  public onClickSearchResult$: EventEmitter<any>
  public onClickCategoryResult$: EventEmitter<any>;

  public onChangeSearchButtonVisibility$: EventEmitter<boolean>;
  public onClickSearchButton$: EventEmitter<boolean>;

  public searchResult$: EventEmitter<any>;

  constructor() {
    this.onChangeSearchButtonVisibility$ = new EventEmitter();
    this.onClickSearchButton$ = new EventEmitter();
    this.searchResult$ = new EventEmitter();
    this.onKeySearchText$ = new EventEmitter();
    this.onClickSearchResult$ = new EventEmitter();
    this.onClickCategoryResult$ = new EventEmitter();
  }
}
