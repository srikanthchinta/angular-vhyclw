import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, AuthenticationService } from 'digital-services-library';
import { LoginService } from './login.service';
import { HelperService } from '../../../common/helper.service';
import { TranslateCacheService } from 'ngx-translate-cache';
import { IUserDetails } from '../../../common/user-details';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  inValidCredentials = false;
  showLoadingIndicator: boolean;
  @ViewChild('userName', null) userNameElement: ElementRef;
  constructor(private formBuilder: FormBuilder,
              private utilService: UtilService,
              private authenticationService: AuthenticationService,
              private loginService: LoginService,
              private helperService: HelperService,
              private translateCacheService: TranslateCacheService
  ) { }

  ngOnInit() {
    if (this.utilService.getValueFromSessionStorage('AuthToken')) {
      this.helperService.loginPageRevisitedWithOutLogOut(true);
      window.location.reload();
    }
    this.showLoadingIndicator = false;
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.userNameElement) {
      this.userNameElement.nativeElement.focus();
    }
  }
  get f() { return this.loginForm.controls; }
  onLoginSubmit() {
    this.showLoadingIndicator = true;
    this.inValidCredentials = false;
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }
    const cachedLanguageId = (this.translateCacheService.getCachedLanguage() === 'en') ? 1 : 2;
    const user: User = {
      userId: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value, languageId: cachedLanguageId
    };
    this.loginService.validateUser('ADLogin', user)
      .subscribe((response: any) => {
        if (response) {
          this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.token));
          let userDetails: IUserDetails;
          userDetails = {
            name: response.userName, profilePic: response.profilePicture, roles: response.userRoles,
            defaultRoleId: response.defaultRoleId, defaultRoleName: response.defaultRoleName
          };
          this.helperService.setLoggedInUserProfileDetails(userDetails);
          this.authenticationService.isAuthenticated = true;
          this.showLoadingIndicator = true;
          this.inValidCredentials = false;
          this.utilService.navigateByUrl('dashboard');
        }
      },
        (error: any) => {
          console.error(error);
          this.showLoadingIndicator = false;
          this.inValidCredentials = true;
          this.authenticationService.isAuthenticated = false;
          this.utilService.clearLocalStorage();
        });
  }
  onInputChange(): void {
    this.inValidCredentials = false;
  }
}
export interface User {
  userId: string;
  password: string;
  languageId: number;
}
