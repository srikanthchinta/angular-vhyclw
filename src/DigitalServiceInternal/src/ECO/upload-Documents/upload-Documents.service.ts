import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadedDocumentsDetailsService {
    private eqsCommonApiUrl = environment.eqsCommonApiUrl;
    private commonApiUrl = environment.commonApiUrl;

    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) {
    }

    getUploadedDocumentsDetails(methodName: string, id: number): Observable<any> {
        const eqsIDDTO = { eQSApplicationId: id };
        return this.commonApiServiceCallsService.getWithResource(this.eqsCommonApiUrl + methodName, eqsIDDTO);
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
