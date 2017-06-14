import {Injectable} from "@angular/core";


@Injectable()
export class TokenService {
  constructor() { }
  private tokenName : string = 'token';

  saveToken(token : string) {
    localStorage.setItem(this.tokenName, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }
  clearToken(){
    localStorage.removeItem(this.tokenName);
  }
  setMapState(value: boolean){
    localStorage.setItem("state", value ? "1" : "0");
  }
  getMapState() : boolean {
    let ref : string = localStorage.getItem('state');
    return ref == null ? false :  ref === '1';
  }
}
