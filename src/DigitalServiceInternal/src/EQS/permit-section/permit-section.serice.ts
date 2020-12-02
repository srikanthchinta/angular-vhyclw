import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PermitSectionService {
    private eqsTechReviewerApiUrl = environment.eqsTechReviewerApiUrl;

    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) {
    }

    getPermitSectionDetails(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, eqsIdDTO);
    }

    saveRecommendationDetails(methodName: string, resource: any): Observable<any> {
        const eqsRecommendationDTO = {
            eQSApplicationId: resource.eQSApplicationId, studyRequired: resource.studyRequired,
            studyTypeId: resource.studyTypeId, internalComments: resource.internalComments, externalComments: resource.externalComments,
            delayJustification: resource.delayJustification, recommendedActionId: resource.recommendedActionId
        };
        return this.commonApiServiceCallsService.create(this.eqsTechReviewerApiUrl + methodName, eqsRecommendationDTO);
    }

    updatePermitConditionStatus(methodName: string, id: number, eqsApplication: number): Observable<any> {
        const eqsPermitConditionInputDTO = { permitConditionId: id, eqsApplicationId: eqsApplication };
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, eqsPermitConditionInputDTO);
    }

    getFacilityProjectClassDetails(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, eqsIdDTO);
    }

    loadRequestForAssistanceDetails(methodName: string, resource: any): Observable<any> {
        const eqsIdDTO = { eQSApplicationId: resource.id, dataClassificationTypeId: resource.dataClassificationTypeId };
        return this.commonApiServiceCallsService.getWithResource(this.eqsTechReviewerApiUrl + methodName, eqsIdDTO);
    }

    getPermitConditionsDetails(methodName: string, id: number): Observable<any> {
        return new Observable<null>();
    }
}
