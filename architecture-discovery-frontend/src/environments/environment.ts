// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {HttpHeaders} from "@angular/common/http";

const user = 'cmluser';
const password = 'secret-1';
let headers = new HttpHeaders();
headers.append('Authorization', 'Basic ' + btoa(user + ':' + password));
headers.append('Content-Type', 'application/x-www-form-urlencoded');

export const environment = {
  production: false,
  livelogWSConnectionString: 'ws://131.159.30.173:2506/?topic=adCMLTopic',
  //discoveryRestAPIBaseURI: 'https://cmlzip2.sebis.in.tum.de/api/v1/ad/',
  //discoveryRestAPIBaseURI: 'http://localhost:9413/api/v1/ad/',
  discoveryRestAPIBaseURI: 'http://vmmatthes2.informatik.tu-muenchen.de:2505/api/v1/ad/',
  headers: headers


};
