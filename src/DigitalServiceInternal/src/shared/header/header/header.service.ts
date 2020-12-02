import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private authenticateServiceUrl = environment.authenticateServiceUrl;
    constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }

    tokenForUserRoleChange(methodName: string, roleId: number): Observable<any> {
        const idDTO = { id: roleId };
        return this.commonApiServiceCallsService.getWithResource(this.authenticateServiceUrl + methodName, idDTO);
    }
}
