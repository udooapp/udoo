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

@Injectable()
export class OfferService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http,  private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  saveOffer(offer: Offer): Observable<String> {
    return this.http.post(this.userUrl + '/saveoffer/' + JSON.parse(this.tokenService.getToken()).username, JSON.stringify(offer), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleError);
  }

  getUserOffer(): Observable<Offer[]> {
    return this.http.post(this.userUrl + '/offer', this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }
  deleteUserOffer(id : number): Observable<string> {
    return this.http.post(this.userUrl + '/deleteoffer/' + id, this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
  getOffer(oid: number): Observable<Offer> {
    return this.http.get(this.userUrl + '/offer/' + oid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }
}
