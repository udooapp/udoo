import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {Router} from "@angular/router";
import {LOGIN} from "../app/app.routing.module";
import {HeaderService} from "./header.service";

@Injectable()
export class BidService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService, private router: Router) {
    super();
  }

  public savePid(pid): Observable<any> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([LOGIN]);
      return Observable.throw('First, login');
    } else {
      return this.http.post(config.server + '/bid/save', pid, new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
        .map(HandlerService.extractText)
        .catch(HandlerService.handleText);
    }
  }

  public sendPidResponse(pid: number, type: boolean): Observable<any[]> {
    return this.http.post(config.server + '/bid/response', JSON.stringify({
      id: pid,
      result: type ? 1 : 0
    }), new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken())
    }))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }

  public sendPaymentReminder(pid: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('bid', pid.toString());
    return this.http.get(config.server + '/bid/reminder', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()), search: param
    }))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }


  public getBids(count: number, last: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append("count", count.toString());
    param.append('last', last.toString());
    return this.http.get(config.server + '/bid/user', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()), search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public cancelBid(bid: number): Observable<string> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('bid', bid.toString());
    return this.http.get(config.server + '/bid/cancel', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()), search: param
    }))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }

  public sendPayment(bid: number): Observable<string> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('bid', bid.toString());
    return this.http.get(config.server + '/bid/send', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()), search: param
    }))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }

  public confirmBid(bid: number): Observable<string> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('bid', bid.toString());
    return this.http.get(config.server + '/bid/confirm', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()), search: param
    }))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }
}
