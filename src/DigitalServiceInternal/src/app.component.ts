import { Component, OnInit } from '@angular/core';
import { UtilService } from 'digital-services-library';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';
import { CommonApiServiceCallsService } from 'digital-services-library';
import { Router } from '@angular/router';
import { TranslateCacheService } from 'ngx-translate-cache';
import { HelperService } from './common/helper.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAppLanguageEnglish = true;
  appDirection = 'LTR';
  constructor(private utilService: UtilService,
              private translate: TranslateService,
              private commonApiServiceCallService: CommonApiServiceCallsService,
              private translateCacheService: TranslateCacheService,
              private helperService: HelperService,
              public router: Router
  ) {
    this.initializeApp();
  }
  initializeApp() {
    if (this.translateCacheService.getCachedLanguage() === 'en') {
      this.isAppLanguageEnglish = true;
      this.translate.use('en');
      this.appDirection = 'LTR';
      document.documentElement.setAttribute('lang', 'en');
    } else if (this.translateCacheService.getCachedLanguage() === 'ar') {
      this.isAppLanguageEnglish = false;
      this.translate.use('ar');
      this.appDirection = 'RTL';
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      this.isAppLanguageEnglish = true;
      this.translate.use('en');
      this.appDirection = 'LTR';
      document.documentElement.setAttribute('lang', 'en');
    }
  }
  ngOnInit() {
    this.helperService.doDbCalls(false);
  }
  setAppLanguage(): void {
    const authToken = JSON.parse(this.utilService.getValueFromSessionStorage('AuthToken'));
    if (authToken === null) {
      if (this.translateCacheService.getCachedLanguage() === 'en') {
        this.isAppLanguageEnglish = false;
        this.translate.use('ar');
        this.appDirection = 'RTL';
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        this.isAppLanguageEnglish = true;
        this.translate.use('en');
        this.appDirection = 'LTR';
        document.documentElement.setAttribute('lang', 'en');
      }
    } else {
      const languageId = (this.translateCacheService.getCachedLanguage() === 'en') ? 2 : 1;
      this.commonApiServiceCallService.get(environment.authenticateServiceUrl + 'ChangeUserLanguage', languageId)
        .subscribe((response: any) => {
          if (response !== undefined) {
            this.utilService.clearSessionStorage();
            this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.token));
            if (this.translateCacheService.getCachedLanguage() === 'en') {
              this.isAppLanguageEnglish = false;
              this.translate.use('ar');
              this.appDirection = 'RTL';
              document.documentElement.setAttribute('lang', 'ar');
            } else {
              this.isAppLanguageEnglish = true;
              this.translate.use('en');
              this.appDirection = 'LTR';
              document.documentElement.setAttribute('lang', 'en');
            }
            this.helperService.doDbCalls(false);
          }
        });
    }
  }
}
