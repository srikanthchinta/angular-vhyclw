import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService, UtilService } from 'digital-services-library';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class StudiesService {
    private commonApiUrl = environment.commonApiUrl;
    private eqsTechReviewerApiUrl = environment.eqsTechReviewerApiUrl;
    private httpHeaders: HttpHeaders;

    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService, private httpClient: HttpClient,
                private utilService: UtilService) {
    }

    getStudiesPageDetails(methodName: string, resource: any): Observable<any> {
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, resource);
    }

    saveStudyDetails(methodName: string, resource: any): Observable<any> {
        const formData = new FormData();
        for (const file of resource.technicalReviewForm) {
            formData.append('TechReviewerForm', file);
        }

        for (const file of resource.evaluationSheet) {
            formData.append('EvalutionSheetFile', file);
        }

        formData.append('EQSApplicationId', resource.eqsApplicationId);
        formData.append("StudyAndReportUploadId", resource.studyAndReportUploadId);
        formData.append('RecommendedActionId', resource.recommendedActionId);
        formData.append('DelayJustification', resource.delayJustification);
        formData.append('ExternalComments', resource.externalComments);
        formData.append('InternalComments', resource.internalComments);
        formData.append('StudyTypeId', resource.studyTypeId);
        formData.append('IsAdditionalStudyRequired', resource.isAdditionalStudyRequired);
        formData.append('StudyScore', resource.studyScore);
        formData.append('IsEnableStudyScore', resource.enableStudyScore);
        this.httpHeaders = new HttpHeaders();
        const authToken = JSON.parse(this.utilService.getValueFromSessionStorage('AuthToken'));

        if (authToken != null) {
            this.httpHeaders = this.httpHeaders.set('Authorization', 'Bearer ' + authToken);
        }
        return this.httpClient.post(this.eqsTechReviewerApiUrl + methodName, formData, { headers: this.httpHeaders });
    }

    loadRequestForAssistanceDetails(methodName: string, resource: any): Observable<any> {
        const eqsIdDTO = { eQSApplicationId: resource.id, dataClassificationTypeId: resource.dataClassificationTypeId };
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, eqsIdDTO);
    }

    getSubmittedStudyHistory(methodName: string, resource: any): Observable<any> {
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, resource);
    }

    downLoadTechnicalReviewTemplate(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = { StudyAndReportUploadId: id };
        return this.commonApiServiceCallsService.getFileDataWithResouce(this.eqsTechReviewerApiUrl + methodName, eqsIdDTO);
    }

    downloadDocument(methodName: string, id: number): Observable<any> {
        const documentIdDTO = { UploadedDocumentId: id };
        return this.commonApiServiceCallsService.getFileDataWithResouce(this.commonApiUrl + methodName, documentIdDTO);
    }
}
