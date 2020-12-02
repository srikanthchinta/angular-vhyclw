import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private customerHappinessServiceUrl = environment.customerHappinessServiceUrl;
  private eqsTechReviewerApiUrl = environment.eqsTechReviewerApiUrl;
  private commonApiUrl = environment.commonApiUrl;
  private authenticateServiceUrl = environment.authenticateServiceUrl;
  private commercialFishingAppUrl = environment.commercialFishingCommonApiUrl;
  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }

  getCommonDashboardDetails(methodName: string, resouce: any): any {
    return this.commonApiServiceCallsService.select(this.commonApiUrl + methodName, resouce);
  }

  getserviceDetails(methodName: string): any {
    return this.commonApiServiceCallsService.getAll(this.commonApiUrl + methodName);
  }

  getApplicationNumberDetails(methodName: string, id: number): any {
    return this.commonApiServiceCallsService.get(this.customerHappinessServiceUrl + methodName, id);
  }

  claimRecreationalApplication(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.customerHappinessServiceUrl + methodName, resource);
  }

  revokeClaimedRecreationalApplication(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.customerHappinessServiceUrl + methodName, resource);
  }

  reClaimRecreationalApplication(methodName: string, resource: any): any {
    return this.commonApiServiceCallsService.create(this.customerHappinessServiceUrl + methodName, resource);
  }

  claimEQSApplication(methodName: string, rowData: any): Observable<any> {
    const resource = {
      eQSApplicationId: rowData.subServiceApplicationId, rowVersion: rowData.rowVersion,
      dataClassificationTypeId: rowData.dataClassificationTypeId, studyAndReportUploadId: rowData.requestId
    };
    return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, resource);
  }

  revokeClaimedEQSApplication(methodName: string, rowData: any): Observable<any> {
    const resource = {
      eQSApplicationId: Number(rowData.subServiceApplicationId), rowVersion: rowData.rowVersion,
      dataClassificationTypeId: rowData.dataClassificationTypeId, studyAndReportUploadId: rowData.requestId
    };
    return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, resource);
  }

  reClaimEQSApplicaiton(methodName: string, iDataTransferBetweenPages: any): Observable<any> {
    const resource = {
      eQSApplicationId: Number(iDataTransferBetweenPages.id), rowVersion: iDataTransferBetweenPages.rowVersion,
      dataClassificationTypeId: iDataTransferBetweenPages.dataClassificationTypeId,
      studyAndReportUploadId: iDataTransferBetweenPages.requestId,
      claimedByUserId: iDataTransferBetweenPages.claimedByUserId
    };
    return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, resource);
  }

  claimECOApplication(methodName: string, rowData: any): Observable<any> {
    const resource = {
      eQSApplicationId: Number(rowData.subServiceApplicationId), rowVersion: rowData.rowVersion,
      dataClassificationTypeId: rowData.dataClassificationTypeId
    };

    return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, resource);
  }

  revokeClaimedECOApplication(methodName: string, rowData: any): Observable<any> {
    const resource = {
      eQSApplicationId: Number(rowData.subServiceApplicationId), rowVersion: rowData.rowVersion,
      dataClassificationTypeId: rowData.dataClassificationTypeId
    };
    return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, resource);
  }

  reClaimECOApplicaiton(methodName: string, iDataTransferBetweenPages: any): Observable<any> {
    const resource = {
      eQSApplicationId: Number(iDataTransferBetweenPages.id), rowVersion: iDataTransferBetweenPages.rowVersion,
      dataClassificationTypeId: 1
    };
    return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, resource);
  }

  tokenForUserRoleChange(methodName: string, roleId: number): Observable<any> {
    const idDTO = { id: roleId };
    return this.commonApiServiceCallsService.getWithResource(this.authenticateServiceUrl + methodName, idDTO);
  }

  claimReclaimRevokeCommercialFishingApp(methodName: string, rowData: any, condition: boolean): Observable<any> {
    const claimReclaimRevokeCommercial = {
      CommercialFishingApplicationId: rowData.subServiceApplicationId,
      claim: condition
    };
    return this.commonApiServiceCallsService.create(this.commercialFishingAppUrl + methodName, claimReclaimRevokeCommercial);
  }
}
