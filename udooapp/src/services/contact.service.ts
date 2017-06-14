import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {Router} from "@angular/router";
import {LOGIN} from "../app/app.routing.module";

@Injectable()
export class ContactService {
  private headers;

  constructor(private http: Http, private tokenService: TokenService, private router: Router) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', config.client);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }
  private refreshHeaderToken(){
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
  }
  public addContact(uid: number): Observable<string> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([LOGIN]);
      return Observable.throw('First, login');
    }
    this.refreshHeaderToken();
    return this.http.post(config.server + '/contact/addcontact', JSON.stringify({
      id: uid,
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getContacts(): Observable<any[]> {
    this.refreshHeaderToken();
    return this.http.get(config.server + '/contact/contacts', new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public removeContact(uid: number): Observable<string> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/contact/deleteContact/', JSON.stringify({
      id: uid
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
}
