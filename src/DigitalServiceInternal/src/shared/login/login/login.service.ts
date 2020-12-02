import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.authenticateServiceUrl;
  private userProfileServiceUrl = environment.userProfileServiceUrl;

  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }

  validateUser(methodName: string, resouce: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resouce);
  }

  validateProfile(methodName: string): any {
    return this.commonApiServiceCallsService.getAll(this.userProfileServiceUrl + methodName);
  }
}
