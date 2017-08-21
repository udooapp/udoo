import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {HeaderService} from "./header.service";

@Injectable()
export class ChatService extends HeaderService {
  private URL_NAME: string = '/message';

  constructor(private http: Http, private tokenService: TokenService) {
    super();
  }

  public setChecked(uid: number): Observable<string> {
    return this.http.post(config.server + this.URL_NAME + '/checked', uid, new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendMessage(message: string, uid: number): Observable<any> {
    return this.http.post(config.server + this.URL_NAME + '/send', JSON.stringify({
      uid: uid,
      message: message
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }

  public getUserConversations(count: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('count', count.toString());
    return this.http.get(config.server + this.URL_NAME + '/conversations', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()),
      search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }

  public getUserMessages(count: number, uid: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('count', count.toString());
    param.append('uid', uid.toString());
    return this.http.get(config.server + this.URL_NAME + '/messages', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()),
      search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getMessagesData(uid: number): Observable<any> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('uid', uid.toString());
    return this.http.get(config.server + this.URL_NAME + '/data', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()),
      search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }

}
