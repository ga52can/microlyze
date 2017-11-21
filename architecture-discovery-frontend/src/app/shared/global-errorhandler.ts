import {ToasterService} from 'angular2-toaster/angular2-toaster';
import { ErrorHandler, Injectable} from '@angular/core';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private toasterService: ToasterService) { }
  handleError(error:Error) {
    console.warn(error);
     this.toasterService.pop('error', "Error: " + error.name, error.message);
     throw error;
  }
  
}