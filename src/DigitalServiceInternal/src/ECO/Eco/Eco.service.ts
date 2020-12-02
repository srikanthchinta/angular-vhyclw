import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';
import { AppConstants } from './../../constants/constants';
@Injectable({
    providedIn: 'root'
})
export class EcoService {
    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) {
    }

    private eqsCommonApiUrl = environment.eqsCommonApiUrl;
    private ecoTechReviewerApiUrl = environment.ecoTechReviewerApiUrl;

    getFacilityDetails(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = {
            eQSApplicationId: id,
            DataClassificationTypeId: AppConstants.dataClassificationTypes.application
        };
        return this.commonApiServiceCallsService.getWithResource(this.eqsCommonApiUrl + methodName, eqsIdDTO);

    }
    getApplicationHeaderDetails(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = {
            eQSApplicationId: id,
            DataClassificationTypeId: AppConstants.dataClassificationTypes.application
        };
        return this.commonApiServiceCallsService.getWithResource(this.eqsCommonApiUrl + methodName, eqsIdDTO);
    }
    getLatestComments(methodName: string, resource: any): Observable<any> {
        const eqsIdDTO = {
            eQSApplicationId: resource.eqsApplicationId,
            DataClassificationTypeId: AppConstants.dataClassificationTypes.application
        };
        return this.commonApiServiceCallsService.getWithResource(this.ecoTechReviewerApiUrl + methodName, eqsIdDTO);

    }
}
