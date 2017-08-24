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
export class BookmarkService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService, private router: Router) {
    super();
  }

  public save(sid: number, type: boolean): Observable<any> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([ROUTES.LOGIN]);
      return Observable.throw('First, login');
    } else {
      return this.http.post(config.server + '/bookmark/save', JSON.stringify({
        sid: sid,
        type: type
      }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
        .map(HandlerService.extractText)
        .catch(HandlerService.handleError);
    }
  }

  public get(count: number): Observable<any[]> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([ROUTES.LOGIN]);
      return Observable.throw('First, login');
    } else {
      let param = new URLSearchParams();
      param.set('count', count.toString());
      return this.http.get(config.server + '/bookmark', new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken()), search: param}))
        .map(HandlerService.extractData)
        .catch(HandlerService.handleError);
    }
  }

  public remove(sid: number, type: boolean): Observable<any> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([ROUTES.LOGIN]);
      return Observable.throw('First, login');
    } else {
      return this.http.post(config.server + '/bookmark/remove', JSON.stringify({
        sid: sid,
        type: type
      }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
        .map(HandlerService.extractText)
        .catch(HandlerService.handleError);
    }
  }
}
