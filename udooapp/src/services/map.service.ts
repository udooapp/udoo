import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";
import {Request} from "../entity/request";
import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";

@Injectable()
export class MapService {
  private headers;

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', config.client);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  public getOfferLocations(category: number, searchText: string): Observable<Offer[]> {
    return this.http.get(config.server + '/offer/offers/' + category + '/' + (searchText ? searchText : ''), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }

  public getRequestLocations(category: number, searchText: string): Observable<Request[]> {
    return this.http.get(config.server + '/request/requests/' + category + '/' + (searchText ? searchText : ''), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getCategories(): Observable<Object[]> {
    return this.http.get(config.server + '/categories', new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError)
  }

}
