import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";

@Injectable()
export class OfferService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  saveOffer(offer: Offer): Observable<String> {
    return this.http.post(this.userUrl + '/saveoffer', offer.toString(), new RequestOptions({headers: this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUserOffer(uid: number): Observable<Offer[]> {
    return this.http.get(this.userUrl + '/offerlist/' + uid)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getOffer(oid: number): Observable<Offer> {
    return this.http.get(this.userUrl + '/offer/' + oid)
      .map(this.extractData)
      .catch(this.handleError);
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
