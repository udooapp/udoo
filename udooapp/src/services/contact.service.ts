import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {Router} from "@angular/router";
import {HeaderService} from "./header.service";
import {ROUTES} from "../app/app.routing";

@Injectable()
export class ContactService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService, private router: Router) {
    super()
  }

  public addContact(uid: number): Observable<string> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([ROUTES.LOGIN]);
      return Observable.throw('First, login');
    }
    return this.http.post(config.server + '/contact/add', JSON.stringify({
      id: uid,
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getContacts(count: number, last: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('count', count.toString());
    param.append('last', last.toString());
    return this.http.get(config.server + '/contact/contacts', new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken()), search: param}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleErrorText);
  }

  public removeContact(uid: number): Observable<string> {
    return this.http.post(config.server + '/contact/deleteContact/', JSON.stringify({
      id: uid
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
}
