import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Request} from '../entity/request'
import {TokenService} from "../guard/TokenService";
import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";
@Injectable()
export class RequestService {
  private headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', config.client);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  saveRequest(request: Request): Observable<String> {
    return this.http.post(config.server + '/saverequest', JSON.stringify({
      token: JSON.parse(this.tokenService.getToken()),
      request: request
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  getUserRequest(): Observable<Request[]> {
    return this.http.post(config.server + '/request', this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  deleteUserRequest(id: number): Observable<string> {
    return this.http.post(config.server + '/deleterequest', JSON.stringify({
      id: id,
      token: JSON.parse(this.tokenService.getToken())
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  getRequest(rid: number): Observable<Request> {
    return this.http.get(config.server + '/request/' + rid, new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
}
