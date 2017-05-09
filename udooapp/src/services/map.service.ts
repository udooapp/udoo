import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";
import {Request} from "../entity/request";

@Injectable()
export class MapService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  getOfferLocations(category : number, searchText : string): Observable<Offer[]> {
    return this.http.get(this.userUrl + '/offers/' + category + '/' + (searchText ? searchText : ''))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRequestLocations(category : number, searchText : string): Observable<Request[]> {
    return this.http.get(this.userUrl + '/requests/' + category + '/' + (searchText ? searchText : ''))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCategories() : Observable<Object[]>{
    return this.http.get(this.userUrl + '/categories')
      .map(this.extractData)
      .catch(this.handleError)
  }


  private extractData(res: Response) {
    return res.json() || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
