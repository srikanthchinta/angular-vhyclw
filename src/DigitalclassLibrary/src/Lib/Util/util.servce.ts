import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
@Injectable({
  providedIn: "root"
})
export class UtilService {
  private displayText: string;

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}

  private get getDisplayTextValue(): string {
    return this.displayText;
  }

  private set setDisplayTextValue(value: string) {
    this.displayText = value;
  }

  navigateWithData(url: any, data: any): Promise<boolean> {
    const navigationExtras: NavigationExtras = {
      state: {
        pageData: data
      }
    };

    return this.router.navigate(url, navigationExtras);
  }

  getPageData(): any {
    if (this.router.getCurrentNavigation().extras.state) {
      return this.router.getCurrentNavigation().extras.state.pageData;
    }
  }

  navigateTo(url: any[]): Promise<boolean> {
    return this.router.navigate(url);
  }

  navigateByUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  setValueToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getValueFromLocalStorage(key: string): string {
    return localStorage.getItem(key);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  setValueToSessionStorage(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getValueFromSessionStorage(key: string): string {
    return sessionStorage.getItem(key);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  getDisplayText(key: string): string {
    this.translateService.get(key).subscribe(value => {
      this.setDisplayTextValue = value;
    });

    return this.getDisplayTextValue;
  }

  setApplicationLanguage(language: string): void {
    this.translateService.setDefaultLang(language);
  }
}
