import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AppError } from './../core/app-error';
import { BadRequestError } from './../core/bad-request-error';
import { NotFoundError } from './../core/not-found-error';
import { BusinessValidationError } from '../core/business-validation-error';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = false;
  token: string;

  constructor(private httpClient: HttpClient) {
  }

  AuthenticateUser(apiUrl: string, user: any): Observable<any> {
    this.isAuthenticated = true;
    return this.httpClient
      .post(apiUrl, user)
      .pipe(catchError(error => this.handleAuthenticationError(error)));
  }

  private handleAuthenticationError(error: Response) {
    this.isAuthenticated = false;

    if (error.status === 401) {
    }

    if (error.status === 404) {
      return throwError(new NotFoundError());
    }

    if (error.status === 400) {
      return throwError(new BadRequestError(AppError));
    }

    if (error.status === 202) {
      return throwError(new BusinessValidationError(error));
    }

    return throwError(AppError);
  }
}
