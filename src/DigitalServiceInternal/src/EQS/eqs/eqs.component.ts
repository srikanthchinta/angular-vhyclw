import { NonCriticalQuestionsDetailsComponent } from './../non-critical-questions-details/non-critical-questions-details.component';
import { CriticalQuestionsDetailsComponent } from './../critical-questions-details/critical-questions-details.component';
import {
  SectorSpecificQuestionsDetailsComponent
} from './../sector-specific-questions-details/sector-specific-questions-details.component';
import { TechnicalDetailsComponent } from './../technical-details/technical-details.component';
import { AppConstants } from './../../constants/constants';
import { EQSService } from './eqs.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'digital-services-library';
import { ActivatedRoute } from '@angular/router';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { AdminstrativeDetailsComponent } from '../adminstrative-details/adminstrative-details.component';
import { UploadedDocumentsDetailsComponent } from '../uploaded-documents-details/uploaded-documents-details.component';
import { PermitSectionComponent } from '../permit-section/permit-section.component';
import { StudiesComponent } from '../studies/studies.component';
import { ReportsComponent } from '../reports/reports.component';
import { InspectionHistoryComponent } from '../inspection-history/inspection-history.component';

@Component({
  selector: 'app-eqs',
  templateUrl: './eqs.component.html',
  styleUrls: ['./eqs.component.scss']
})
export class EqsComponent implements OnInit {
  @ViewChild(AdminstrativeDetailsComponent, null) adminstrativeDetailsComponent: AdminstrativeDetailsComponent;
  @ViewChild(TechnicalDetailsComponent, null) technicalDetailsComponent: TechnicalDetailsComponent;
  @ViewChild(SectorSpecificQuestionsDetailsComponent, null) sectorSpecificQuestionsDetailsComponent:
    SectorSpecificQuestionsDetailsComponent;
  @ViewChild(CriticalQuestionsDetailsComponent, null) criticalQuestionsDetailsComponent: CriticalQuestionsDetailsComponent;
  @ViewChild(NonCriticalQuestionsDetailsComponent, null) nonCriticalQuestionsDetailsComponent: NonCriticalQuestionsDetailsComponent;
  @ViewChild(UploadedDocumentsDetailsComponent, null) uploadedDocumentsDetailsComponent: UploadedDocumentsDetailsComponent;
  @ViewChild(PermitSectionComponent, null) permitSectionComponent: PermitSectionComponent;
  @ViewChild(StudiesComponent, null) studiesComponent: StudiesComponent;
  @ViewChild(ReportsComponent, null) reportsComponent: ReportsComponent;
  @ViewChild(InspectionHistoryComponent, null) inspectionHistoryComponent: InspectionHistoryComponent;
  displayDateFormat = AppConstants.displayDateFormat;
  applicationHistoryData: any;
  pageTitle: string;
  eqsFormGroup: FormGroup;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  first = 0;
  gridPageSize: number = AppConstants.eqsGridPageSize;
  showLoader: boolean;
  deafultTabActiveIndex = 0;
  isPermitSectionReadOnly: boolean;
  isCurrentLanguageEnglish: boolean;

  constructor(private eQSService: EQSService, private utilService: UtilService,
              private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.iDataTransferBetweenPages = this.utilService.getPageData();
    });
  }

  ngOnInit() {
    this.showLoader = false;
    this.isCurrentLanguageEnglish = false;
    this.createEQSForm();
    this.getFacilityDetails();
  }

  get applicationNumber() {
    return this.eqsFormGroup.get('applicationNumber');
  }

  get facilityName() {
    return this.eqsFormGroup.get('facilityName');
  }

  get licenseNumber() {
    return this.eqsFormGroup.get('licenseNumber');
  }

  get externalEntityLicenseNumber() {
    return this.eqsFormGroup.get('externalEntityLicenseNumber');
  }

  get dueDate() {
    return this.eqsFormGroup.get('dueDate');
  }

  get legacyApplicationNumber() {
    return this.eqsFormGroup.get('legacyApplicationNumber');
  }

  onPageLoad(): void {
    this.isPermitSectionReadOnly = false;
  }

  goToPreviousTab(): void {
    this.deafultTabActiveIndex = (this.deafultTabActiveIndex !== 0) ? this.deafultTabActiveIndex - 1 : 0;
    this.getCurrentTabDetails(this.deafultTabActiveIndex);
  }

  goToNextTab(): void {
    this.deafultTabActiveIndex = (this.deafultTabActiveIndex !== 9) ? this.deafultTabActiveIndex + 1 : 9;
    this.getCurrentTabDetails(this.deafultTabActiveIndex);
  }

  backToDashboard(): void {
    this.utilService.navigateTo(['/dashboard']);
  }

  onTabViewChange(event: { index: number; }): void {
    if (!event) {
      return;
    }

    this.deafultTabActiveIndex = event.index;
    this.getCurrentTabDetails(this.deafultTabActiveIndex);
  }

  getApplicationHeader(eqsApplicationId: number): void {
    this.showLoader = true;
    this.eQSService.getApplicationHeaderDetails('GetEQSApplicationHeader', eqsApplicationId)
      .subscribe((applicationHeaderDetails: any) => {
        if (applicationHeaderDetails && applicationHeaderDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.setApplicatioinHeaderDetails(applicationHeaderDetails);
          this.iDataTransferBetweenPages = { id: eqsApplicationId };
          this.showLoader = false;
          this.getCurrentTabDetails(this.deafultTabActiveIndex);
        } else {
          this.showLoader = false;
        }
      }, (error) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  private getFacilityDetails(): void {
    const currentLanguage = document.documentElement.getAttribute('lang');
    this.isCurrentLanguageEnglish = (currentLanguage === 'en') ? true : false;
    (this.isCurrentLanguageEnglish) ? this.deafultTabActiveIndex = 0 : this.deafultTabActiveIndex = 9;
    this.eQSService.getFacilityDetails('GetEQSFacilityDetails', this.iDataTransferBetweenPages.id)
      .subscribe((facilityDetails: any) => {
        if (facilityDetails && facilityDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.setFacilityFormDetails(facilityDetails);
          this.adminstrativeDetailsComponent.getAdminstrativeDetails(facilityDetails.facilityDetails.eqsApplicationId,
            this.iDataTransferBetweenPages.actionTypeId);
        }
      });
  }

  private setApplicatioinHeaderDetails(applicationHeaderDetails: any): void {
    this.eqsFormGroup.patchValue({
      applicationNumber: applicationHeaderDetails.facilityDetails.applicationNumber,
      facilityName: applicationHeaderDetails.facilityDetails.facilityName,
      licenseNumber: applicationHeaderDetails.facilityDetails.licenseNumber,
      externalEntityLicenseNumber: applicationHeaderDetails.facilityDetails.externalEntityLicenseNumber,
      dueDate: applicationHeaderDetails.facilityDetails.dueDate,
      legacyApplicationNumber: applicationHeaderDetails.facilityDetails.legacyApplicationNumber
    });
    this.isPermitSectionReadOnly = applicationHeaderDetails.facilityDetails.isPermitSectionReadOnly;
  }

  private setFacilityFormDetails(facilityDetails: any): void {
    this.pageTitle = facilityDetails.facilityDetails.serviceName;
    this.applicationHistoryData = facilityDetails.applicationsHistory;
    this.eqsFormGroup.patchValue({
      applicationNumber: facilityDetails.facilityDetails.applicationNumber,
      facilityName: facilityDetails.facilityDetails.facilityName,
      licenseNumber: facilityDetails.facilityDetails.licenseNumber,
      externalEntityLicenseNumber: facilityDetails.facilityDetails.externalEntityLicenseNumber,
      dueDate: facilityDetails.facilityDetails.dueDate,
      legacyApplicationNumber: facilityDetails.facilityDetails.legacyApplicationNumber
    });
    this.isPermitSectionReadOnly = facilityDetails.facilityDetails.isPermitSectionReadOnly;
  }

  setDefaultTab(): void {
    const currentLanguage = document.documentElement.getAttribute('lang');
    this.isCurrentLanguageEnglish = (currentLanguage === 'en') ? true : false;
    if (this.iDataTransferBetweenPages.dataClassificationTypeId === AppConstants.dataClassificationTypes.application) {
      (this.isCurrentLanguageEnglish) ? this.deafultTabActiveIndex = 6 : this.deafultTabActiveIndex = 3;
      this.getCurrentTabDetails(this.deafultTabActiveIndex);
    } else if (this.iDataTransferBetweenPages.dataClassificationTypeId === AppConstants.dataClassificationTypes.studies) {
      (this.isCurrentLanguageEnglish) ? this.deafultTabActiveIndex = 7 : this.deafultTabActiveIndex = 2;
      this.getCurrentTabDetails(this.deafultTabActiveIndex);
    } else if (this.iDataTransferBetweenPages.dataClassificationTypeId === AppConstants.dataClassificationTypes.auditReport ||
      this.iDataTransferBetweenPages.dataClassificationTypeId === AppConstants.dataClassificationTypes.monitoringReport) {
      (this.isCurrentLanguageEnglish) ? this.deafultTabActiveIndex = 8 : this.deafultTabActiveIndex = 1;
      this.getCurrentTabDetails(this.deafultTabActiveIndex);
    } else {
      this.deafultTabActiveIndex = 0;
      this.getCurrentTabDetails(this.deafultTabActiveIndex);
    }
  }

  private getCurrentTabDetails(tabIndex: number): void {
    switch (tabIndex) {
      case 0:
        if (this.adminstrativeDetailsComponent && this.iDataTransferBetweenPages) {
          this.adminstrativeDetailsComponent.getAdminstrativeDetails(this.iDataTransferBetweenPages.id,
            this.iDataTransferBetweenPages.actionTypeId);
        }
        break;
      case 1:
        if (this.technicalDetailsComponent && this.iDataTransferBetweenPages) {
          this.technicalDetailsComponent.getTechnicalDetails(this.iDataTransferBetweenPages.id);
        }
        break;
      case 2:
        if (this.sectorSpecificQuestionsDetailsComponent && this.iDataTransferBetweenPages) {
          this.sectorSpecificQuestionsDetailsComponent.getSectorSpecificQuestions(this.iDataTransferBetweenPages.id);
        }
        break;
      case 3:
        if (this.criticalQuestionsDetailsComponent && this.iDataTransferBetweenPages) {
          this.criticalQuestionsDetailsComponent.getCriticalQuestionsDetails(this.iDataTransferBetweenPages.id);
        }
        break;
      case 4:
        if (this.nonCriticalQuestionsDetailsComponent && this.iDataTransferBetweenPages) {
          this.nonCriticalQuestionsDetailsComponent.getNonCriticalQuestionsDetails(this.iDataTransferBetweenPages.id);
        }
        break;
      case 5:
        if (this.uploadedDocumentsDetailsComponent && this.iDataTransferBetweenPages) {
          this.uploadedDocumentsDetailsComponent.getUploadedDocumentsDetails(this.iDataTransferBetweenPages.id);
        }
        break;
      case 6:
        if (this.permitSectionComponent && this.iDataTransferBetweenPages) {
          this.permitSectionComponent.getPermitSectionDetails(this.iDataTransferBetweenPages, this.isPermitSectionReadOnly);
        }
        break;
      case 7:
        if (this.studiesComponent && this.iDataTransferBetweenPages) {
          this.studiesComponent.getStudiesPageDetails(this.iDataTransferBetweenPages);
        }
        break;
      case 8:
        if (this.reportsComponent && this.iDataTransferBetweenPages) {
          this.reportsComponent.getReportsPageDetails(this.iDataTransferBetweenPages);
        }
        break;
      case 9:
        if (this.inspectionHistoryComponent && this.iDataTransferBetweenPages) {
          this.inspectionHistoryComponent.getInspectionHisotry(this.iDataTransferBetweenPages.id);
        }
        break;
    }
  }

  private createEQSForm(): void {
    this.eqsFormGroup = new FormGroup({
      applicationNumber: new FormControl('', null),
      facilityName: new FormControl('', null),
      licenseNumber: new FormControl('', null),
      externalEntityLicenseNumber: new FormControl('', null),
      dueDate: new FormControl('', null),
      legacyApplicationNumber: new FormControl('', null)
    });
  }
}
