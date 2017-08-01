export interface MainSearchListener{

  onKey(text);
  onCategoryChange(id);
  onTypeChangeId(index);
  onClickResultDropdown(index);
  loadMoreElementMap();
  getSearchData(): any;
  getData(page: number)
}
