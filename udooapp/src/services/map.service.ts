import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';
import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";

@Injectable()
export class MapService {

  constructor(private http: Http) {}
  public getAvailableServices(category: number, searchText: string): Observable<any> {
    let param: URLSearchParams= new URLSearchParams();
    param.append('category', category.toString());
    param.append('search', searchText);
    return this.http.get(config.server + '/search', new RequestOptions({search: param}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getAvailableResults(searchText: string): Observable<any> {
    let param: URLSearchParams= new URLSearchParams();
    param.append('search', searchText);
    return this.http.get(config.server + '/result', new RequestOptions({search: param}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getMoreAvailableServices(category: number, searchText: string, offerCount: number, requestCount: number): Observable<any> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('category', category.toString());
    param.append('oCount', offerCount.toString());
    param.append('rCount', requestCount.toString());
    param.append('search', searchText);
    return this.http.get(config.server + '/more',  new RequestOptions({search: param}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getCategories(): Observable<Object[]> {
    return this.http.get(config.server + '/categories')
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError)
  }

}
