import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {User} from '../entity/user';
import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {HeaderService} from "./header.service";

@Injectable()
export class UserService extends HeaderService{

  constructor(private http: Http, private tokenService: TokenService) {
    super();
  }

  public logout(): Observable<String> {
    let param: URLSearchParams = new URLSearchParams();
    param.append("param", "param");
    return this.http.get(config.server + '/user/logout', new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken()), search: param}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public loginFacebook(socialData: any): Observable<any> {
    return this.http.post(config.server + '/social', JSON.stringify(socialData), new RequestOptions({headers: this.getHeader()}))
      .map((response: Response)=>{
        if(response.text().startsWith("{")){
          return response.json();
        } else {
          let token = response.text();
          if (token) {
            this.tokenService.saveToken(token);
            return null;
          }
        }
      })
      .catch(HandlerService.handleText);
  }

  public loginUser(user: User): Observable<string> {

    return this.http.post(config.server + '/login', JSON.stringify(user), new RequestOptions({headers: this.getHeader()}))
      .map((response: Response) => {
        let token = response.text();
        if (token) {
          this.tokenService.saveToken(token);
          return '';
        }
      }).catch((response: Response) => {
        return HandlerService.handleErrorText(response)
      });
  }

  public updateUser(user: User): Observable<String> {
    return this.http.post(config.server + '/user/update',
      JSON.stringify(user)
      , new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserData(): Observable<any> {
    return this.http.get(config.server + '/user/userdata', new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public registrateUser(user: User): Observable<String> {
    return this.http.post(config.server + '/registration', JSON.stringify(user), new RequestOptions({headers: this.getHeader()}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public registrateFacebookUser(user: User): Observable<String> {
    return this.http.post(config.server + '/social/registration', JSON.stringify(user), new RequestOptions({headers: this.getHeader()}))
      .map((response: Response) => {
        let token = response.text();
        if (token) {
          this.tokenService.saveToken(token);
          return '';
        }
      }).catch((response: Response) => {
        return HandlerService.handleErrorText(response)
      });
  }

  public changePassword(cpass: string, npass: string): Observable<String> {
    return this.http.post(config.server + '/user/password', JSON.stringify({
      cpass: cpass,
      npass: npass,
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public uploadPicture(file: File): Observable<String> {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(config.server + '/upload', formData)
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText)
  }
}
