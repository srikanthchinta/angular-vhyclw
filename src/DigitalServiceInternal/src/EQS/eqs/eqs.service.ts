import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class EQSService {
    private eqsCommonApiUrl = environment.eqsCommonApiUrl;
    private eqsCustomerScreensForInternalUrl = environment.eqsCustomerScreensForInternal;

    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) {
    }

    getFacilityDetails(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.eqsCustomerScreensForInternalUrl + methodName, eqsIdDTO);
    }

    getApplicationHeaderDetails(methodName: string, id: number): Observable<any> {
        const eqsIdDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.eqsCustomerScreensForInternalUrl + methodName, eqsIdDTO);
    }
}
