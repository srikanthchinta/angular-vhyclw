import { EcoService } from './eco.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminstrativeDetailsComponent } from '../adminstrative-details/adminstrative-details.component';
import { PermitSectionComponent } from '../permit-section/permit-section.component';
import { UploadedDocumentsDetailsComponent } from '../uploaded-documents-details/uploaded-documents-details.component';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'digital-services-library';
import { AppConstants } from './../../constants/constants';
import { HelperService } from '../../common/helper.service';
@Component({
  selector: 'app-eco',
  templateUrl: './eco.component.html',
  styleUrls: ['./eco.component.scss']
})
export class EcoComponent implements OnInit {

  @ViewChild(AdminstrativeDetailsComponent, null) adminstrativeDetailsComponent: AdminstrativeDetailsComponent;
  @ViewChild(PermitSectionComponent, null) permitSectionComponent: PermitSectionComponent;
  @ViewChild(UploadedDocumentsDetailsComponent, null) uploadDocumentDetailsComponent: UploadedDocumentsDetailsComponent;
  displayDateFormat = AppConstants.displayDateFormat;
  applicationHistoryData: any;
  pageTitle: string;
  ecoFormGroup: FormGroup;
  viewTechReviewerCommentGroup: FormGroup;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  first = 0;
  eqsApplicationId: number;
  isApplicationReadOnly: boolean;
  localstoredeqsApplicationId: any;
  showLoader: boolean;
  displayLatestComentsdialog: boolean;
  deafultTabActiveIndex = 0;
  gridPageSize = AppConstants.eqsGridPageSize;

  constructor(private ecoService: EcoService,
    private utilService: UtilService,
    private helperService: HelperService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.iDataTransferBetweenPages = this.utilService.getPageData();
    });
  }

  ngOnInit() {
    this.onPageLoad();
  }
  private onPageLoad(): void {
    this.helperService.doDbCalls(false);
    this.helperService.subscription = this.helperService.languageChanged
      .subscribe(languageChanged => {
        if (languageChanged) {
          this.createECOForm();
          this.createTechReviewerCommentsForm();
          this.getFacilityDetails();

        } else {
          this.getCurrentTabDetails(this.deafultTabActiveIndex);
          this.createECOForm();
          this.getFacilityDetails();
          this.createTechReviewerCommentsForm();
          this.displayLatestComentsdialog = false;
          this.eqsApplicationId = this.iDataTransferBetweenPages.id;
          this.showLoader = false;
        }
      });

  }
  get applicationNumber() {
    return this.ecoFormGroup.get('applicationNumber');
  }

  get facilityName() {
    return this.ecoFormGroup.get('facilityName');
  }

  get externalEntityLicenseNumber() {
    return this.ecoFormGroup.get('externalEntityLicenseNumber');
  }

  get licenceNo() {
    return this.ecoFormGroup.get('licenceNo');
  }

  get dueDate() {
    return this.ecoFormGroup.get('dueDate');
  }

  get legacyApplicationNumber() {
    return this.ecoFormGroup.get('legacyApplicationNumber');
  }

  get externalcomment() {
    return this.viewTechReviewerCommentGroup.get('externalcomment');
  }

  goToPreviousTab(): void {
    this.deafultTabActiveIndex = (this.deafultTabActiveIndex !== 0) ? this.deafultTabActiveIndex - 1 : 0;
    this.getCurrentTabDetails(this.deafultTabActiveIndex);
  }

  goToNextTab(): void {
    this.deafultTabActiveIndex = (this.deafultTabActiveIndex !== 2) ? this.deafultTabActiveIndex + 1 : 2;
    this.getCurrentTabDetails(this.deafultTabActiveIndex);
  }

  backToDashboard(): void {
    this.utilService.navigateTo(['/dashboard']);
  }
  onTabViewChange(event): void {
    if (!event) {
      return;
    }

    this.deafultTabActiveIndex = event.index;
    this.getCurrentTabDetails(this.deafultTabActiveIndex);

  }
  private getCurrentTabDetails(tabIndex: number): void {
    switch (tabIndex) {
      case 0:
        if (this.adminstrativeDetailsComponent && this.iDataTransferBetweenPages) {
          this.adminstrativeDetailsComponent.getAdminstrativeDetails(this.iDataTransferBetweenPages.id);
          this.eqsApplicationId = this.iDataTransferBetweenPages.id;
        }
        break;
      case 1:
        if (this.uploadDocumentDetailsComponent && this.iDataTransferBetweenPages) {
          this.uploadDocumentDetailsComponent.getUploadedDocuments(this.iDataTransferBetweenPages.id);
          this.eqsApplicationId = this.iDataTransferBetweenPages.id;
        }
        break;
      case 2:
        if (this.permitSectionComponent && this.iDataTransferBetweenPages) {
          this.permitSectionComponent.getPermitSectionDetails(this.iDataTransferBetweenPages, this.isApplicationReadOnly);
          this.eqsApplicationId = this.iDataTransferBetweenPages.id;
        }
        break;
    }
  }



  getApplicationHeader(eqsApplicationId: number): void {
    this.showLoader = true;
    this.ecoService.getApplicationHeaderDetails('GetEQSApplicationHeader', eqsApplicationId)
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
  getFacilityDetails(): void {
    this.showLoader = false;
    this.ecoService.getFacilityDetails('GetEQSFacilityDetails', this.iDataTransferBetweenPages.id)
      .subscribe((facilityDetails: any) => {
        if (facilityDetails) {
          if (facilityDetails && facilityDetails.responseCode === AppConstants.APIResponseCodes.success) {
            this.setFacilityPageDetails(facilityDetails);
            this.adminstrativeDetailsComponent.getAdminstrativeDetails(facilityDetails.facilityDetails.eqsApplicationId);
            this.showLoader = false;
          }
        }
      }, (error) => {
        console.error(error);
        this.showLoader = false;
      });
  }
  private setApplicatioinHeaderDetails(applicationHeaderDetails: any): void {
    if (applicationHeaderDetails.facilityDetails) {
      this.isApplicationReadOnly = applicationHeaderDetails.facilityDetails.isApplicationReadOnly;
      this.ecoFormGroup.patchValue({
        applicationNumber: applicationHeaderDetails.facilityDetails.applicationNumber,
        facilityName: applicationHeaderDetails.facilityDetails.facilityName,
        licenseNumber: applicationHeaderDetails.facilityDetails.licenseNumber,
        externalEntityLicenseNumber: applicationHeaderDetails.facilityDetails.externalEntityLicenseNumber,
        dueDate: applicationHeaderDetails.facilityDetails.dueDate,
        legacyApplicationNumber: applicationHeaderDetails.facilityDetails.legacyApplicationNumber
      });
    }
  }
  private setFacilityPageDetails(facilityDetails: any): void {
    if (facilityDetails.facilityDetails !== null) {
      this.pageTitle = facilityDetails.facilityDetails.serviceName;
      this.isApplicationReadOnly = facilityDetails.facilityDetails.isPermitSectionReadOnly;
      this.applicationHistoryData = facilityDetails.applicationsHistory;
      this.ecoFormGroup.patchValue({
        applicationNumber: facilityDetails.facilityDetails.applicationNumber,
        facilityName: facilityDetails.facilityDetails.facilityName,
        externalEntityLicenseNumber: facilityDetails.facilityDetails.externalEntityLicenseNumber,
        licenceNo: facilityDetails.facilityDetails.licenseNumber,
        dueDate: facilityDetails.facilityDetails.dueDate,
        legacyApplicationNumber: facilityDetails.facilityDetails.legacyApplicationNumber
      });
    }
  }
  getLatestExternalComments(rowdata: any): void {
    this.showLoader = true;
    this.ecoService.getLatestComments('GetTechReviewerExternalComment', rowdata)
      .subscribe((techreviewercomments: any) => {
        this.showLoader = false;
        this.viewTechReviewerCommentGroup.patchValue({
          externalcomment: null
        });
        if (techreviewercomments && techreviewercomments.responseCode === AppConstants.APIResponseCodes.success) {
          this.viewTechReviewerCommentGroup.patchValue({
            externalcomment: techreviewercomments.result.externalComment
          });
        }

      }, (error) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  getLatestExternalComment(rowdata: any): void {
    this.displayLatestComentsdialog = !this.displayLatestComentsdialog;
    this.getLatestExternalComments(rowdata);
  }

  closeTechreviewercommentspopup(): void {
    this.displayLatestComentsdialog = false;
  }
  private createECOForm(): void {
    this.ecoFormGroup = new FormGroup({
      applicationNumber: new FormControl('', null),
      facilityName: new FormControl('', null),
      externalEntityLicenseNumber: new FormControl('', null),
      licenceNo: new FormControl('', null),
      dueDate: new FormControl('', null),
      legacyApplicationNumber: new FormControl('', null),
    });
  }
  private createTechReviewerCommentsForm(): void {
    this.viewTechReviewerCommentGroup = new FormGroup({
      externalcomment: new FormControl('', null)
    });
  }
}
