import {Injectable} from "@angular/core";


@Injectable()
export class TokenService {
  constructor() { }
  private tokenName : string = 'token';
  private PAGE_STATE : string = 'state';
  private SEARCH_TEXT: string  = 'searchText';
  private SEARCH_TYPE: string  = 'searchType';
  private SEARCH_CATEGORY: string  = 'searchCategory';

  saveToken(token : string) {
    localStorage.setItem(this.tokenName, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }
  clearToken(){
    localStorage.removeItem(this.tokenName);
  }
  setPageState(value: number){
    localStorage.setItem(this.PAGE_STATE, value.toString());
  }
  getPageState() : number {
    let ref : string = localStorage.getItem(this.PAGE_STATE);
    let num = Number.parseInt(ref);
    if(num == null || num < 0 || num > 2){
      return 1;
    } else {
      return num;
    }
  }

  getSearchData():any{
    return {
      text: localStorage.getItem(this.SEARCH_TEXT),
      type: localStorage.getItem(this.SEARCH_TYPE),
      category: localStorage.getItem(this.SEARCH_CATEGORY)
    };
  }

  clearSearchData(){
    localStorage.removeItem(this.SEARCH_TEXT);
    localStorage.removeItem(this.SEARCH_TYPE);
    localStorage.removeItem(this.SEARCH_CATEGORY);
  }

  saveSearchData(text: string, type: number, category: number){
    localStorage.setItem(this.SEARCH_TEXT, text);
    localStorage.setItem(this.SEARCH_TYPE, type.toString());
    localStorage.setItem(this.SEARCH_CATEGORY, category.toString());
  }
}
