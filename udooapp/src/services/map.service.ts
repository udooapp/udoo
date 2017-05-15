import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";
import {Request} from "../entity/request";
import {HandlerService} from "./handler.service";

@Injectable()
export class MapService {
  private headers;

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  getOfferLocations(category : number, searchText : string): Observable<Offer[]> {
    return this.http.get(HandlerService.URL + '/offers/' + category + '/' + (searchText ? searchText : ''))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  getRequestLocations(category : number, searchText : string): Observable<Request[]> {
    return this.http.get(HandlerService.URL + '/requests/' + category + '/' + (searchText ? searchText : ''))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  getCategories() : Observable<Object[]>{
    return this.http.get(HandlerService.URL + '/categories')
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError)
  }

}
