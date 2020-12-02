import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';
import { AppConstants } from './../../constants/constants';

@Injectable({
    providedIn: 'root'
})
export class PermitSectionService {
    private ecoCusotomerApiUrl = environment.ecoCustomerApiUrl;
    private ecoTechReviewerApiUrl = environment.ecoTechReviewerApiUrl;
    private eqsTechReviewerApiUrl = environment.eqsTechReviewerApiUrl;
    private eqsCommonApiUrl = environment.eqsCommonApiUrl;
    private commonApiUrl = environment.commonApiUrl;
    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) {
    }

    getPermitSectionDetails(methodName: string, id: any): Observable<any> {
        const eqsIDDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.ecoCusotomerApiUrl + methodName, eqsIDDTO);
    }
    getResourceTechnicalDetails(methodName: string, resource: any): Observable<any> {
        return this.commonApiServiceCallsService.select(this.ecoCusotomerApiUrl + methodName, resource);
    }
    getFacilityDetails(methodName: string, resource: any): Observable<any> {
        return this.commonApiServiceCallsService.getWithResource(this.ecoTechReviewerApiUrl + methodName, resource);
    }

    getRemarks(methodName: string, id: number): Observable<any> {
        const eqsIDDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.ecoTechReviewerApiUrl + methodName, eqsIDDTO);
    }
    getPermitSectionsDetails(methodName: string, resource: any): Observable<any> {
        const eqsIDDTO = { eQSApplicationId: resource.id, DataClassificationTypeId: AppConstants.dataClassificationTypes.application };
        return this.commonApiServiceCallsService.getWithResource(this.ecoTechReviewerApiUrl + methodName, eqsIDDTO);
    }

    getTechnicalDetails(methodName: string, id: any): Observable<any> {
        const eqsIDDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.ecoTechReviewerApiUrl + methodName, eqsIDDTO);
    }
    getApprovalStauts(methodName: string): Observable<any> {
        return this.commonApiServiceCallsService.getAll(this.ecoTechReviewerApiUrl + methodName);
    }
    getFileDetails(methodName: string, id: any): Observable<any> {
        const eqsIDDTO = { UploadedDocumentId: id };
        return this.commonApiServiceCallsService.getWithResource(this.commonApiUrl + methodName, eqsIDDTO);
    }
    getApplicationHistoryService(methodName: string, resource: any): Observable<any> {
        const eqsIDDTO = { eQSApplicationId: resource.Id };
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, eqsIDDTO);
    }

    saveData(methodName: string, resource: any): Observable<any> {
        return this.commonApiServiceCallsService.select(this.ecoTechReviewerApiUrl + methodName, resource);
    }

    deleteRemarks(methodName: string, resource: any): Observable<any> {
        return this.commonApiServiceCallsService.create(this.ecoTechReviewerApiUrl + methodName, resource);
    }
    downloadUploadedFile(methodName: string, id: number): Observable<any> {
        const documentIdDTO = { uploadedDocumentId: id };
        return this.commonApiServiceCallsService.getFileDataWithResouce(this.commonApiUrl + methodName, documentIdDTO);
    }
    UploadedFileExist(methodName: string, id: number): Observable<any> {
        const documentIdDTO = { uploadedDocumentId: id };
        return this.commonApiServiceCallsService.getWithResource(this.commonApiUrl + methodName, documentIdDTO);
    }
}
