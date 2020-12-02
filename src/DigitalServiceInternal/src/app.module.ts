import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { TableModule } from 'primeng/table';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecreationalComponent } from './../app/customer-happiness/recreational/recreational.component';
import { HeaderComponent } from './shared/header/header/header.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FooterComponent } from './shared/footer/footer/footer.component';
import { LoginComponent } from './shared/login/login/login.component';
import { ClickOutsideDirective } from './shared/click-outside.directive';
import { CheckboxModule } from 'primeng/checkbox';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';
import { ListboxModule } from 'primeng/listbox';
import { NotFoundComponent } from './not-found/not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RecreationalComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ClickOutsideDirective,
    NotFoundComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    TableModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: translateCacheFactory,
        deps: [TranslateService, TranslateCacheSettings]
      },
      cacheMechanism: 'Cookie'
    }),
    DropdownModule,
    ReactiveFormsModule,
    DialogModule,
    CalendarModule,
    CheckboxModule,
    ListboxModule,

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translateService: TranslateService, private translateCacheService: TranslateCacheService) {
    this.translateCacheService.init();
    this.translateService.addLangs(['en', 'ar']);
    const browserLanguage = this.translateCacheService.getCachedLanguage() || this.translateService.getBrowserLang();
    this.translateService.use(browserLanguage);
  }
}
export function translateCacheFactory(translateService: TranslateService, translateCacheSettings: TranslateCacheSettings) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../assets/i18n/', '.json');
}
