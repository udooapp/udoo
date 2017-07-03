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
  public getAvailableServices(category: number, searchText: string, type: number): Observable<any> {
    return this.http.get(config.server + '/search/' + category + (searchText ? '/' + searchText : '') + '/' + type)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getMoreAvailableServices(category: number, searchText: string, type: number, offerCount: number, requestCount: number): Observable<any> {
    let param: URLSearchParams = new URLSearchParams();
    param.append('category', category.toString());
    param.append('search', searchText);
    param.append('type', type.toString());
    param.append('oCount', offerCount.toString());
    param.append('rCount', requestCount.toString());
    return this.http.get(config.server + '/more',  new RequestOptions({search: param}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
  public getCategories(): Observable<Object[]> {
    return this.http.get(config.server + '/categories')
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError)
  }
  public getAvailableResults(searchText: string, type: number): Observable<any> {
    return this.http.get(config.server + '/result' + (searchText ? '/' + searchText : '') + '/' + type)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleText);
  }
}
