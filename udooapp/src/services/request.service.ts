import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Request} from '../entity/request'
import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
@Injectable()
export class RequestService {
  private headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', config.client);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }
  private refreshHeaderToken(){
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
  }

  public createRequest(src: String): Observable<any> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/request/user/create', src, new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
  public uploadPicture(rid: number, src: string): Observable<number> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/request/user/upload', JSON.stringify({
      prid: rid,
      src: src
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
  public saveRequest(request: Request, deleted: number): Observable<String> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/request/user/save', JSON.stringify({
      request: request,
      delete: deleted
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserRequest(): Observable<Request[]> {
    this.refreshHeaderToken();
    return this.http.get(config.server + '/request/user', new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public deleteUserRequest(id: number, deleted: number): Observable<string> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/request/user/delete', JSON.stringify({
      id: id,
      delete: deleted
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getRequest(rid: number): Observable<any> {
    return this.http.get(config.server + '/request/' + rid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getRequestData(rid: number): Observable<any> {
    return this.http.get(config.server + '/request/data/' + rid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
}
