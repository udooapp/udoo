import {Injectable} from "@angular/core";


@Injectable()
export class TokenService {
  constructor() { }
  private tokenName : string = 'currentUser';

  saveToken(token : string, user : string) {
    localStorage.setItem(this.tokenName, JSON.stringify({ username: user, token: token }));
  }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }
  clearToken(){
    localStorage.removeItem(this.tokenName);
  }
  setRefresh(value: boolean){
    localStorage.setItem("refresh", value ? "1" : "0");
  }
  getRefresh() : boolean {
    let ref : string = localStorage.getItem('refresh');
    localStorage.setItem('refresh', '0');
    return ref == null ? false :  ref === '1';
  }
}
