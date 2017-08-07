export interface MainSearchListener{
  onKey(text);
  onCategoryChange(id);
  onTypeChangeId(index);
  onClickResultDropdown(index);
  onClickService(id: number, type: boolean, location: string);
  loadMoreElementMap();
  onBidClickSendOffer(type: boolean, id: number);
  getSearchData(): any;
  getData(page: number)
}
