import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {SearchController} from "../../controllers/search.controller";


@Component({
  selector: 'toolbar-search',
  templateUrl: './toolbar.search.component.html',
  styleUrls: ['./toolbar.search.component.css']
})

export class ToolbarSearchComponent {
  public searchOffer: string = 'babysitting';
  public categoryOffer: any[] = [
    {
      id: 1,
      searchResult: 'Part-time babysitting',
      categoryName: 'Babysitting'
    }, {
      id: 1,
      searchResult: 'Babysitting',
      categoryName: 'House Services'
    }
  ];

  public visible: boolean = false;
  public animation: string = '';
  private searchText = '';

  @Output() public search: EventEmitter<string> = new EventEmitter();
  @Output() public close: EventEmitter<boolean> = new EventEmitter();
  @Output() public clickCategory: EventEmitter<number> = new EventEmitter();
  @Output() public clickSearchOffer: EventEmitter<string> = new EventEmitter();

  constructor(private searchController: SearchController) {
    searchController.searchResult$.subscribe(value => {
      if (value == null) {
        this.searchOffer = '';
        this.categoryOffer = [];
      } else {
        this.searchOffer = value.searchOffer ? value.searchOffer : '';
        this.categoryOffer = value.categoryOffer ? value.categoryOffer : [];
      }
      if(this.searchOffer.length == 0 && this.categoryOffer.length > 0){
        this.searchOffer = this.searchText;
      } else if(this.searchOffer.length == 0 && this.categoryOffer.length == 0){
        this.searchOffer = '';
      }
    });
  }

  @Input()
  public set visibility(value: boolean) {
    this.visible = value;
    if (this.visible) {
      this.searchOffer = '';
      this.categoryOffer = [];
    }

  }

  @Input()
  public set data(value: any) {
    if (value == null) {
      this.searchOffer = '';
      this.categoryOffer = [];
    } else {
      this.searchOffer = value.searchOffer ? value.searchOffer : '';
      this.categoryOffer = value.categoryOffer ? value.categoryOffer : [];
    }
  }

  @HostListener('document:keydown', ['$event'])
  keypress(e: KeyboardEvent) {
    if (e.keyCode == 27) {
      this.onClickClose();
    }
  }

  public onClickClose() {
    this.close.emit(true);
    this.visible = false;
  }

  public onKeySearch(event) {
    this.search.emit(event);
    this.searchText = event.target.value;
    this.searchController.onKeySearchText$.emit(event);
  }

  public onClickCategory(id: number, searchResult: string) {
    this.close.emit(true);
    this.clickCategory.emit(id);
    this.visible = false;
    this.searchController.onClickCategoryResult$.emit({id: id, searchResult: searchResult});
  }

  public onClickShowAllCategory(search: string) {
    this.close.emit(true);
    this.visible = false;
    this.clickSearchOffer.emit(search);
    this.searchController.onClickSearchResult$.emit(search);
  }
}
