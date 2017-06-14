import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";
import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";

@Injectable()
export class OfferService {
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
  public saveOffer(offer: Offer): Observable<String> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/offer/user/saveoffer', JSON.stringify(offer), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserOffer(): Observable<Offer[]> {
    this.refreshHeaderToken();
    return this.http.get(config.server + '/offer/user/offer', new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public deleteUserOffer(id: number): Observable<string> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/offer/user/deleteoffer', JSON.stringify({
      id: id
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getOffer(oid: number): Observable<Offer> {
    return this.http.get(config.server + '/offer/' + oid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }
}
