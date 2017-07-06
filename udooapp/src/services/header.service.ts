
import {Headers} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";

export class HeaderService {
  private headers: Headers;

  constructor() {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', `${config.client}`);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }

  public getTokenHeaders(token: string): Headers{
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + token);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + token);
    }
    return this.headers;
  }
  public getHeader():Headers{
    if (this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.delete(HandlerService.AUTHORIZATION);
    }
    return this.headers;
  }
}
