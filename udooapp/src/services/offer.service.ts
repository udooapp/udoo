import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

import {Offer} from "../entity/offer";
import {TokenService} from "./token.service";
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {HeaderService} from "./header.service";

@Injectable()
export class OfferService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService) {
    super();
  }


  public createOffer(src: String): Observable<any> {
    return this.http.post(config.server + '/offer/user/create', src, new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public uploadPicture(oid: number, src: string): Observable<number> {
    return this.http.post(config.server + '/offer/user/upload', JSON.stringify({
      poid: oid,
      src: src
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }


  public saveOffer(offer: Offer, deleted: number): Observable<String> {
    return this.http.post(config.server + '/offer/user/save', JSON.stringify({
      offer: offer,
      delete: deleted
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserOffers(count: number, lastid: number): Observable<any[]> {
    let param: URLSearchParams = new URLSearchParams();
    param.append("count", count.toString());
    param.append("last", lastid.toString());
    return this.http.get(config.server + '/offer/user', new RequestOptions({
      headers: this.getTokenHeaders(this.tokenService.getToken()),
      search: param
    }))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public deleteUserOffer(id: number, deleted: number): Observable<string> {
    return this.http.post(config.server + '/offer/user/delete', JSON.stringify({
      id: id,
      delete: deleted
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public getUserOffer(oid: number): Observable<any> {
    return this.http.get(config.server + '/offer/user/' + oid, new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  public getOfferData(oid: number): Observable<any> {
    return this.http.get(config.server + '/offer/data/' + oid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }
}
