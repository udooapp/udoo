import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";
import {TokenService} from "../guard/TokenService";
import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";

@Injectable()
export class OfferService {
  private headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', config.client);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  saveOffer(offer: Offer): Observable<String> {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
    return this.http.post(config.server + '/user/saveoffer', JSON.stringify({
      offer: offer
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  getUserOffer(): Observable<Offer[]> {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
    return this.http.get(config.server + '/user/offer', new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  deleteUserOffer(id: number): Observable<string> {
    this.headers.append("Token", JSON.parse(this.tokenService.getToken()).token);
    return this.http.post(config.server + '/user/deleteoffer', JSON.stringify({
      id: id
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  getOffer(oid: number): Observable<Offer> {
    return this.http.get(config.server + '/offer/' + oid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }
}
