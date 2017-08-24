import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Request} from '../entity/request'
import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {HeaderService} from "./header.service";

@Injectable()
export class RequestService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService) {
    super();
  }

  public createRequest(src: String): Observable<any> {
    return this.http.post(config.server + '/request/user/create', src, new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public uploadPicture(rid: number, src: string): Observable<number> {
    return this.http.post(config.server + '/request/user/upload', JSON.stringify({
      prid: rid,
      src: src
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public saveRequest(request: Request, deleted: number): Observable<String> {
    return this.http.post(config.server + '/request/user/save', JSON.stringify({
      request: request,
      delete: deleted
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserRequests(count: number, lastid: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append("count", count.toString());
    param.append("last", lastid.toString());
    return this.http.get(config.server + '/request/user', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()),
      search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleErrorText);
  }

  public deleteUserRequest(id: number, deleted: number): Observable<string> {
    return this.http.post(config.server + '/request/user/delete', JSON.stringify({
      id: id,
      delete: deleted
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserRequest(rid: number): Observable<any> {
    return this.http.get(config.server + '/request/user/' + rid, new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }

  public getRequestData(rid: number): Observable<any> {
    return this.http.get(config.server + '/request/data/' + rid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getRequestDialogData(rid: number): Observable<any> {
    let param = new URLSearchParams();
    param.append('rid', rid.toString());
    let login = this.tokenService.getToken().length > 0;
    return this.http.get(config.server + '/request' + (login ? '/user' : '') + '/data/dialog',  new RequestOptions({search: param, headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
}
