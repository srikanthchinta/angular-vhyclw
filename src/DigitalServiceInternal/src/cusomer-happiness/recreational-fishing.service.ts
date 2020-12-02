import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecreationalService {

  private apiUrl = environment.customerHappinessServiceUrl;
  private recreationalFishingApiUrl = environment.recreationalFishingServiceUrl;

  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }

  getApplicationNumberDetails(methodName: string, id: number): any {
    return this.commonApiServiceCallsService.get(this.apiUrl + methodName, id);
  }

  approved(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  cardPrinted(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  cardDispatched(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  requiredMore(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  reClaim(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  claim(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  revokeClaim(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.apiUrl + methodName, resource);
  }

  getApplicationHistory(methodName: string, id): any {
    return this.commonApiServiceCallsService.get(this.apiUrl + methodName, id);
  }

  getCourierProviders(methodName: string): any {
    return this.commonApiServiceCallsService.getAll(this.apiUrl + methodName);
  }

  public getFileData(methodName: string, id: number): Observable<any> {
    return this.commonApiServiceCallsService.getFileData(this.recreationalFishingApiUrl + methodName, id);
  }

  public getCustomerFileData(methodName: string, id: number): Observable<any> {
    return this.commonApiServiceCallsService.getFileData(this.apiUrl + methodName, id);
  }
}
