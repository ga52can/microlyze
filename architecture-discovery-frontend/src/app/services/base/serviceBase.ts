import { HttpClient } from '@angular/common/http';
import { environment } from "environments/environment";

export class ServiceBase {
  constructor(protected http: HttpClient) { }
  protected apiUrl = environment.discoveryRestAPIBaseURI;
}  