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
export class WallService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService) {
    super();
  }

  public getWall(lastId: number): Observable<any> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('last', lastId.toString());
      return this.http.get(config.server + '/wall' + (this.tokenService.getToken() ? '/user' : '/public'), new RequestOptions(!this.tokenService.getToken() ? {search: param} :  {headers: this.getTokenHeaders(this.tokenService.getToken()), search: param}))
        .map(HandlerService.extractData)
        .catch(HandlerService.handleText);
  }
}
