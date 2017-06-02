import {Observable} from "rxjs/Observable";
import {Response} from '@angular/http';

export class HandlerService {
  public static AUTHORIZATION:string = 'Authorization';

  public static extractText(res: Response) {
    return res.text();
  }

  public static handleText(error: Response | any) {
    let errMsg : string ='';
    if(error  instanceof  Response){
      switch (error.status) {
        case 0:
          errMsg = 'No internet connection';
          break;
        case 408:
          errMsg = 'Time out';
          break;
        case 404:
          errMsg = 'Not found';
          break;
        case 401:
          errMsg = 'Unauthorized';
          break;
        case 498:
          errMsg = 'Invalid token';
          break;
        case 500:
          errMsg = 'Server error';
          break;
        case 503:
          errMsg = 'Service Unavailable';
          break;
        default:
          if(error.status >= 500 && error.status < 600){
            errMsg = 'Server error';
          } else {
            errMsg = 'Something\'s wrong here...\tTry again later';
          }
      }
    } else {
      errMsg = 'Something\'s wrong here...\tTry again later';
    }
    console.log('Error: ' + error.toString() + "\n" + errMsg);
    return Observable.throw(errMsg);
  }

  public static extractData(res: Response) {
    return JSON.parse(res.text()) || {};
  }

  public static handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      switch (error.status) {
        case 0:
          errMsg = 'No internet connection';
          break;
        case 408:
          errMsg = 'Time out';
          break;
        case 404:
          errMsg = 'Not found';
          break;
        case 401:
          errMsg = 'Incorrect password or data';
          break;
        case 498:
          errMsg = 'Invalid token';
          break;
        case 500:
          errMsg = 'Server error';
          break;
        case 503:
          errMsg = 'Service Unavailable';
          break;
        default:
          if(error.status >= 500 && error.status < 600){
            errMsg = 'Server error';
          } else {
            errMsg = 'Something\'s wrong here...\tTry again later';
          }
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log('Error: ' + error.toString());
    return Observable.throw(errMsg);
  }}
