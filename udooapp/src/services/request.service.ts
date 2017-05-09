import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Request} from '../entity/request'
import {TokenService} from "../guard/TokenService";
import {HandlerService} from "./handler.service";
@Injectable()
export class RequestService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http, private tokenService : TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  saveRequest(request: Request): Observable<String> {
    return this.http.post(this.userUrl + '/saverequest/' + JSON.parse(this.tokenService.getToken()).username, JSON.stringify(request), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }

  getUserRequest(): Observable<Request[]> {
    return this.http.post(this.userUrl + '/request', this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  deleteUserRequest(id : number): Observable<string> {
    return this.http.post(this.userUrl + '/deleterequest/' + id, this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
  getRequest(rid : number): Observable<Request> {
    return this.http.get(this.userUrl + '/request/' + rid, new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }
}
