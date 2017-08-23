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
export class CommentService extends HeaderService{

  constructor(private http: Http, private tokenService: TokenService, private router: Router) {
    super();
  }
  public saveComment(comment): Observable<any> {
    if (!this.tokenService.getToken()) {
      this.router.navigate([ROUTES.LOGIN]);
      return Observable.throw('First, login');
    } else {
      return this.http.post(config.server + '/comment/save', comment, new RequestOptions({headers:  this.getTokenHeaders(this.tokenService.getToken())}))
        .map(HandlerService.extractData)
        .catch(HandlerService.handleText);
    }
  }

  public getComments(sid: number, pos: number, type: boolean): Observable<any[]> {
    let param = new URLSearchParams();
    param.append('sid', sid.toString());
    param.append('pos', pos.toString());
    param.append('type', type + '');
    return this.http.get(config.server + '/comment/', new RequestOptions({
      search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleErrorText);
  }
}
