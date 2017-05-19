import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {User} from '../entity/user';
import {TokenService} from "../guard/TokenService";
import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";
import {Router} from "@angular/router";

@Injectable()
export class ContactService {
  private headers;

  constructor(private http: Http, private tokenService: TokenService, private router: Router) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', config.client);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }

  addContact(uid: number): Observable<string> {
    if(!this.tokenService.getToken()){
      this.router.navigate(['/login']);
      return Observable.throw('First, login');
    }
    return this.http.post(config.server + '/addcontact/' + uid, JSON.parse(this.tokenService.getToken()), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  getContacts(): Observable<any[]> {
    return this.http.post(config.server + '/contacts', JSON.parse(this.tokenService.getToken()), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  removeContact(uid: number): Observable<string> {
    return this.http.post(config.server + '/deleteContact/' + uid, JSON.parse(this.tokenService.getToken()), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
}