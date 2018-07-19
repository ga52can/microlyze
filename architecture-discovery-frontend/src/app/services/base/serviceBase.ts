import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest, HttpHeaders,
} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
//import { HttpClient } from '@angular/common/http';
import { environment } from "environments/environment";
import {Injectable} from "@angular/core";

export class ServiceBase {
  protected apiUrl = environment.discoveryRestAPIBaseURI;
  public headers = new HttpHeaders();

  constructor(protected http: HttpClient) {
    this.headers.append('Content-Type', 'application/json;charset=utf-8');
  }
}

/*
@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header

     //const clonedRequest = req.clone({ headers: req.headers.append('Authorization', 'Basic ' + btoa('cmluser:secret-1')) });
    const clonedRequest = req.clone({ headers: req.headers.set("Authorization", "Basic " + btoa("cmluser:secret-1")).set("Content-Type", "application/x-www-form-urlencoded")});
    //const clonedRequest = req.clone({ headers: req.headers.set('test', 'test13') });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
*/
