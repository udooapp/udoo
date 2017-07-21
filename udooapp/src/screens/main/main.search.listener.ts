export interface MainSearchListener{

  onKey(text);
  onCategoryChange(id);
  onTypeChangeId(index);
  onClickResultDropdown(index);
  loadMoreElement();
  getSearchData(): any;
  getData(page: number)
}
