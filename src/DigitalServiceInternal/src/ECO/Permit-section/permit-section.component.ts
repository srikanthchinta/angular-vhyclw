import { AddViewRemarksComponent } from './../add-view-remarks/add-view-remarks.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewFieldsOfWorkComponent } from './../view-fields-of-work/view-fields-of-work.component';
import { ViewTechnicalTeamDetailsComponent } from './../view-technical-team-details/view-technical-team-details.component';
import { ViewProjectDetailsComponent } from './../view-project-details/view-project-details.component';
import { HelperService } from './../../common/helper.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { iDropdown } from '../../constants/constants';
import { PermitSectionService } from './permit-section.service';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { AppConstants } from './../../constants/constants';
import { iPermit, iPermitRecommandations } from './permit-section';
import * as fileSaver from 'file-saver';
import { InformationDialogComponent } from '../../shared/information-dialog/information-dialog.component';
import { ConfirmationDialogComponent } from './../../shared/confirmation-dialog/confirmation-dialog.component';
import { ViewTaskHistoryComponent } from '../../eco/view-task-history/view-task-history.component';
import { UtilService } from 'digital-services-library';
@Component({
  selector: 'eco-permit-section',
  templateUrl: './permit-section.component.html',
  styleUrls: ['./permit-section.component.scss'],
})
export class PermitSectionComponent implements OnInit {

  ecoClasses: iDropdown[];
  restrictTypes: iDropdown[];
  permitSectionFromGroup: FormGroup;
  permitSectionRecommandationFromGroup: FormGroup;
  displayProjectDetailsPopUp: boolean;
  displayTeamDetailsPopUp: boolean;
  displayFieldsOfWorkPopUp: boolean;
  displayAddViewRemarksPopUp: boolean;
  displayViewTaskHistoryPopUp: boolean;
  isFormSubmitted: boolean;
  displayDateFormat = AppConstants.displayDateFormat;
  pageTitle: string;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  first = 0;
  projectDetails: any;
  technicalTeamsDetails: any;
  technicalTeamsintegrationDetails: any;
  previoustechnicalTeamsDetails: any;
  fieldWorkDetails: any;
  restrictedOffices: any;
  remarkDetails: any;
  facilityClassificationDetails: any[];
  applicationHistoryDetails: any;
  approvalStatusDropDownValues: any[];
  iPermit: iPermit;
  recommendedActions: any;
  showLoadingIndicator: boolean;
  iPermitRecommandations: iPermitRecommandations;
  approvalStatusDropDownnvalues: any[];
  eqsApplicationsId: number;
  deleteRemarkId: number;
  @Input() eqsApplicationId;
  selectedfacilityRowData: any[];
  activitiesDetails: any[];
  eQSStudyAndReportUploadIds: string;
  showLoader: boolean;
  displayInformationPopUp: boolean;
  isPermitSectionReadOnly: boolean;
  isRecommendedActionReadOnly: boolean;
  isAllowedActionReadOnly: boolean;
  newSubServiceReadOnly: boolean;
  gridPageSize = AppConstants.eqsGridPageSize;
  activitiesGridFirstPage = 0;
  projectsGridFirstPage = 0;
  previousteamsGridFirstPage = 0;
  technicalteamsGridFirstPage = 0;
  teamsfromIntegrationGridFirstPage = 0;
  fieldOfworkGridFirstPage = 0;
  facilitiesGridFirstPage = 0;
  remarksGridFirstPage = 0;
  statushistorygridGridFirstPage = 0;
  displayConfirmationPopUp: boolean;
  shouldAllowOnlyDecimal = new RegExp(/^\d*\.?\d{0,2}$/g);
  primeNgDateDisplayFormat = AppConstants.primeNgDateDisplayFormat;
  todayDate = AppConstants.currentDate;
  datePlaceHolderFormat = AppConstants.datePlaceHolderFormat;
  @Output() getFacilitiesrDetails = new EventEmitter<number>();


  @ViewChild(ViewProjectDetailsComponent, null) viewProjectDetailsComponent: ViewProjectDetailsComponent;
  @ViewChild(ViewTechnicalTeamDetailsComponent, null) viewTechnicalTeamDetailsComponent: ViewTechnicalTeamDetailsComponent;
  @ViewChild(ViewFieldsOfWorkComponent, null) viewFieldsOfWorkComponent: ViewFieldsOfWorkComponent;
  @ViewChild(ViewTaskHistoryComponent, null) viewTaskHistoryComponent: ViewTaskHistoryComponent;
  @ViewChild(InformationDialogComponent, null) informationComponnet: InformationDialogComponent;
  @ViewChild(AddViewRemarksComponent, null) addViewRemarksComponent: AddViewRemarksComponent;
  @ViewChild(ConfirmationDialogComponent, null) confirmationComponent: ConfirmationDialogComponent;

  constructor(private permitSectionService: PermitSectionService, private helperService: HelperService, private utilService: UtilService) {

  }

  ngOnInit() {
    this.onPageLoad();
  }

  get fromDate() {
    return this.permitSectionFromGroup.get('fromDate');
  }

  get toDate() {
    return this.permitSectionFromGroup.get('toDate');
  }

  get consider() {
    return this.permitSectionFromGroup.get('consider');
  }

  get eCOScore() {
    return this.permitSectionFromGroup.get('eCOScore');
  }

  get eCOClass() {
    return this.permitSectionFromGroup.get('eCOClass');
  }

  get eCOClassId() {
    return this.permitSectionFromGroup.get('eCOClassId');
  }

  get newRemarks() {
    return this.permitSectionFromGroup.get('newRemarks');
  }

  get isrestrictOffice() {
    return this.permitSectionRecommandationFromGroup.get('isrestrictOffice');
  }

  get isrestrictOfficeText() {
    return this.permitSectionRecommandationFromGroup.get('isrestrictOfficeText');
  }

  get restrictType() {
    return this.permitSectionRecommandationFromGroup.get('restrictType');
  }

  get restrictTypeId() {
    return this.permitSectionRecommandationFromGroup.get('restrictTypeId');
  }

  get reasonForRestricting() {
    return this.permitSectionRecommandationFromGroup.get('reasonForRestricting');
  }

  get averageECOScrore() {
    return this.permitSectionFromGroup.get('averageECOScrore');
  }
  get internalComments() {
    return this.permitSectionRecommandationFromGroup.get('internalComments');
  }

  get externalComments() {
    return this.permitSectionRecommandationFromGroup.get('externalComments');
  }

  get delayJustification() {
    return this.permitSectionRecommandationFromGroup.get('delayJustification');
  }

  get recommendedAction() {
    return this.permitSectionRecommandationFromGroup.get('recommendedAction');
  }

  get previousApplicationNmber() {
    return this.permitSectionRecommandationFromGroup.get('previousApplicationNmber');
  }

  get isDelayed() {
    return this.permitSectionRecommandationFromGroup.get('isDelayed');
  }

  get status() {
    return this.permitSectionRecommandationFromGroup.get('status');
  }

  private onPageLoad(): void {
    this.helperService.subscription = this.helperService.languageChanged
      .subscribe(languageChanged => {
        if (languageChanged) {
          this.getPermitSectionDetails(this.iDataTransferBetweenPages, this.isPermitSectionReadOnly);
        } else {
          this.setPermitSectionPageDefaultValues();
          this.getApprovalStatues();
        }
      });
  }

  private setPermitSectionPageDefaultValues(): void {
    this.displayProjectDetailsPopUp = false;
    this.displayTeamDetailsPopUp = false;
    this.displayFieldsOfWorkPopUp = false;
    this.displayAddViewRemarksPopUp = false;
    this.displayViewTaskHistoryPopUp = false;
    this.isFormSubmitted = false;
    this.selectedfacilityRowData = [];
    this.displayInformationPopUp = false;
    this.displayConfirmationPopUp = false;
    this.showLoader = false;
    this.createPermitSectionForm();
    this.createPermitSectionRecommandationForm();

  }

  private getApprovalStatues(): void {
    this.showLoader = true;
    this.permitSectionService.getApprovalStauts('GetapprovalStatusDropdown')
      .subscribe((approvalStatus: any) => {
        if (approvalStatus && approvalStatus.responseCode === AppConstants.APIResponseCodes.success) {
          if (approvalStatus) {
            this.approvalStatusDropDownValues = this.helperService.prepareDropDownData(approvalStatus.approvalStatus);
            this.showLoader = false;
          }
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  getPermitSectionDetails(dataTransferBetweenPages: iDataTransferBetweenPages, isPermitSectionReadOnly: boolean): void {
    this.showLoader = true;
    this.iDataTransferBetweenPages = dataTransferBetweenPages;
    this.isPermitSectionReadOnly = isPermitSectionReadOnly;
    this.eqsApplicationId = this.iDataTransferBetweenPages.id;
    this.permitSectionService.getPermitSectionsDetails('GetPermitSectionDetails', dataTransferBetweenPages)
      .subscribe((permitSectionDetails: any) => {
        if (permitSectionDetails && permitSectionDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.setPermitSectionDetails(permitSectionDetails);
        }
        this.showLoader = false;
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  private setPermitSectionDetails(permitSectionDetails: any): void {
    this.remarkDetails = permitSectionDetails.ecoRemarkDetails;
    this.projectDetails = permitSectionDetails.projectDetils;
    this.facilityClassificationDetails = permitSectionDetails.facilityclassDetails;
    this.previoustechnicalTeamsDetails = permitSectionDetails.previoustechnicalTeamDetails;
    this.technicalTeamsDetails = permitSectionDetails.technicalTeamDetails;
    this.technicalTeamsintegrationDetails = permitSectionDetails.technicalTeamFromIntegrationDetails;
    this.fieldWorkDetails = permitSectionDetails.fieldofWorkDetails;
    this.activitiesDetails = permitSectionDetails.eQSTechnicalActivities;
    this.applicationHistoryDetails = permitSectionDetails.taskhistorydetails;
    this.selectedfacilityRowData = permitSectionDetails.facilityclassDetails
      .filter(a => a.isConsideredForECOClasification === true);

    if (permitSectionDetails.approvalStatus) {
      this.approvalStatusDropDownValues = this.helperService.prepareDropDownData(permitSectionDetails.approvalStatus);
    }
    if (permitSectionDetails.ecoclasses) {
      this.ecoClasses = this.helperService.prepareDropDownData(permitSectionDetails.ecoclasses);
    }
    if (permitSectionDetails.rectrictedOfficeTypes) {
      this.restrictTypes = this.helperService.prepareDropDownData(permitSectionDetails.rectrictedOfficeTypes);
    }
    if (permitSectionDetails.recommendedActions) {
      this.recommendedActions = this.helperService.prepareDropDownData(permitSectionDetails.recommendedActions);
    }
    if (permitSectionDetails.ecoClassifications) {
      this.permitSectionFromGroup.patchValue({
        eCOScore: permitSectionDetails.ecoClassifications.ecoScore,
        eCOClassId: String(permitSectionDetails.ecoClassifications.ecoClassId),
        eCOClass: permitSectionDetails.ecoClassifications.ecoClass,
      });
    }
    if (permitSectionDetails.eCOApplicationRecommandation) {
      this.permitSectionRecommandationFromGroup.patchValue({
        previousApplicationNmber: permitSectionDetails.eCOApplicationRecommandation.applicationNumber,
        isrestrictOffice: permitSectionDetails.eCOApplicationRecommandation.isRestricted,
        isrestrictOfficeText: permitSectionDetails.eCOApplicationRecommandation.isRestrictedText,
        restrictTypeId: ((permitSectionDetails.eCOApplicationRecommandation.restrictedOfficeTypeId) ?
          String(permitSectionDetails.eCOApplicationRecommandation.restrictedOfficeTypeId) : null),
        restrictType: permitSectionDetails.eCOApplicationRecommandation.restrictedOfficeType,
        reasonForRestricting: permitSectionDetails.eCOApplicationRecommandation.reasonForRestriction,
        isDelayed: permitSectionDetails.eCOApplicationRecommandation.isDelayed,
        externalComments: permitSectionDetails.eCOApplicationRecommandation.externalComment,
        status: permitSectionDetails.eCOApplicationRecommandation.status,
      });

      if (this.isrestrictOffice.value) {
        this.restrictTypeId.setValidators([Validators.required]);
        this.restrictTypeId.updateValueAndValidity();
        this.reasonForRestricting.setValidators([Validators.required]);
        this.reasonForRestricting.updateValueAndValidity();
      }

      if (this.selectedfacilityRowData) {
        this.CalculateAverageScore();
      }
      this.isAllowedActionReadOnly = permitSectionDetails.eCOApplicationRecommandation.isAllowedActionReadOnly;
      this.newSubServiceReadOnly = permitSectionDetails.eCOApplicationRecommandation.newSubServiceReadOnly;
      if (this.isDelayed.value) {
        this.delayJustification.setValidators([Validators.required]);
      }

    }
  }

  getRemarks(): void {
    if (!this.eqsApplicationId) { return; }
    this.showLoader = true;
    this.permitSectionService.getRemarks('ApplicationRemarksList', Number(this.iDataTransferBetweenPages.id))
      .subscribe((remarksList: any) => {
        if (remarksList && remarksList.responseCode === AppConstants.APIResponseCodes.success) {
          if (remarksList.result) {
            this.remarkDetails = remarksList.result;
          }
          this.showLoader = false;
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  getApplicationHistory(): void {
    this.showLoader = true;
    this.permitSectionService.getApplicationHistoryService('GetApplicationTaskHistoryList', this.iDataTransferBetweenPages)
      .subscribe((applicationHistoryList: any) => {
        if (applicationHistoryList && applicationHistoryList.responseCode === AppConstants.APIResponseCodes.success) {
          if (applicationHistoryList.result.length > 0) {
            this.applicationHistoryDetails = applicationHistoryList.result;
          }
          this.showLoader = false;
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  saveClassifications(): void {
    this.isFormSubmitted = false;
    if (!this.permitSectionFromGroup.valid) {
      this.isFormSubmitted = true;
      return;
    }
    this.showLoader = true;
    if (this.selectedfacilityRowData.length > 0) {
      this.eQSStudyAndReportUploadIds = this.selectedfacilityRowData
        .filter(a => a.isConsideredForECOClasification === ((a.isConsideredForECOClasification) ? true : a.isConsideredForECOClasification)
          && a.isPreviouslyCosideredApplication === false).map((a) => a.facilityClassificationId).join(',');
    }
    this.iPermit = {
      eCOScore: Number(this.eCOScore.value),
      eCOClassId: Number(this.eCOClassId.value),
      eQSApplicaitonId: Number(this.eqsApplicationId),
      eQSStudyAndReportUploadIds: this.eQSStudyAndReportUploadIds
    };
    this.permitSectionService.saveData('SaveClassification', this.iPermit)
      .subscribe((response: any) => {
        this.showLoader = false;
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.resposnseget(response, 3);
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  UpdateTechnicalteams(): void {
    this.showLoader = true;
    const data = { eQSApplicationId: Number(this.eqsApplicationId) };
    this.permitSectionService.saveData('SaveTechnicalTeamDetailsForIntegrationData', data)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.getIntegrationtechnicalteamDetails();
        }
        this.showLoader = false;
      }, (error: any) => {
        this.showLoader = false;
        this.getIntegrationtechnicalteamDetails();
        console.error(error);
      });
  }

  deleteRemarks(remarkId: number): void {
    const deleteRemarksconfirmationText = this.utilService.getDisplayText('ECOPermitSection.deleteRemarksconfirmationText');
    this.deleteRemarkId = remarkId;
    this.displayConfirmationPopUp = true;
    this.confirmationComponent.setConfirmationMessageText(deleteRemarksconfirmationText);
  }

  clearfacilitysearchData(): void {
    this.fromDate.reset();
    this.toDate.reset();
    this.consider.reset();
    this.getFacilities();
  }

  closeConfirmationPopUp(confirmed: boolean): void {
    if (confirmed) {
      this.displayConfirmationPopUp = false;
      this.showLoader = true;
      const resource = { eqsApplicationId: this.eqsApplicationId, ECORemarksId: this.deleteRemarkId };
      this.permitSectionService.deleteRemarks('DeleteRemarks', resource)
        .subscribe((response: any) => {
          if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
            this.getRemarks();
          }
          this.showLoader = false;
        }, (error: any) => {
          this.showLoader = false;
          console.error(error);
        });
    } else {
      this.displayConfirmationPopUp = false;
    }
  }

  saveRecommandations(): void {
    this.isFormSubmitted = false;
    if (!this.permitSectionRecommandationFromGroup.valid) {
      this.isFormSubmitted = true;
      return;
    }
    if (!this.informationComponnet) {
      return;
    }
    this.showLoader = true;
    this.iPermitRecommandations = {
      isRestricted: Boolean(this.isrestrictOffice.value),
      internalComments: this.internalComments.value,
      externalComments: this.externalComments.value,
      delayJustification: this.delayJustification.value,
      rectrictedTypeId: Number(this.restrictTypeId.value),
      reasonForRestricting: String(this.reasonForRestricting.value),
      eQSApplicationId: Number(this.eqsApplicationId),
      recommendedActionId: Number(this.recommendedAction.value),
    };
    this.permitSectionService.saveData('SaveRecommendation', this.iPermitRecommandations)
      .subscribe((response: any) => {
        this.showLoader = false;
        if (response) {
          this.resposnseget(response, 6);
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  downloadDocument(downloadValues: any) {
    this.downloadDocuments(downloadValues.uploadedDocumentId, downloadValues.customerFileName);
  }

  downloadDocuments(uploadedDocumentId: number, customerFileName: string) {
    if (uploadedDocumentId) {
      this.showLoadingIndicator = true;
      this.showLoader = true;
      this.permitSectionService.UploadedFileExist('UploadFileExist', uploadedDocumentId)
        .subscribe((fileexists) => {
          if (fileexists && fileexists.responseCode === AppConstants.APIResponseCodes.success) {
            this.permitSectionService.downloadUploadedFile('ViewUploadedFile', uploadedDocumentId)
              .subscribe((downloadFileDetails) => {
                if (downloadFileDetails) {
                  fileSaver.saveAs(downloadFileDetails, customerFileName);
                  this.showLoader = false;
                }
              }, (error: any) => {
                this.showLoader = false;
                console.error(error);
              });
          } else if ((this.informationComponnet && fileexists.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
            fileexists.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponnet)) {
            this.informationComponnet.transformMessaages([{ message: 'File Not Found.' }]);
            this.displayInformationPopUp = true;
          } else {
            this.informationComponnet.transformMessaages(fileexists.errorMessages, AppConstants.InformationType.error);
            this.displayInformationPopUp = true;
          }
        }, (error: any) => {
          this.showLoader = false;
          console.error(error);
        });
    }
  }

  Serchfacilities(): void {
    this.getFacilities(Boolean(this.consider.value));
  }

  getFacilities(isIncludeConsiderApplication?: boolean): void {
    if (!this.eqsApplicationId) { return; }
    this.showLoader = true;
    this.iPermit = {
      isConsideredOn: Boolean(isIncludeConsiderApplication),
      startDate: (this.fromDate.value === "" ? null : this.fromDate.value),
      endDate: (this.toDate.value === "" ? null : this.toDate.value),
      eQSApplicaitonId: Number(this.eqsApplicationId)
    };
    this.permitSectionService.getFacilityDetails('FacilityClassificationsList', this.iPermit)
      .subscribe((facilites: any) => {
        if (facilites && facilites.responseCode === AppConstants.APIResponseCodes.success) {
          if (facilites.result) {
            this.showLoader = false;
            this.facilityClassificationDetails = facilites.result;
            this.selectedfacilityRowData = facilites.result
              .filter(
                a => a.isConsideredForECOClasification === true
                  || a.isPreviouslyCosideredApplication === true);
            this.CalculateAverageScore();
          }
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }


  CalculateAverageScore(): void {
    if (this.selectedfacilityRowData) {
      this.permitSectionFromGroup.patchValue({
        averageECOScrore: 0
      });
      let score = this.selectedfacilityRowData
        .filter(a => a.isConsideredForECOClasification === ((a.isConsideredForECOClasification) ? true : a.isConsideredForECOClasification)
          && a.isPreviouslyCosideredApplication === false);
      if (score.length > 0) {
        this.permitSectionFromGroup.patchValue({
          averageECOScrore: score.map((a) => a.ecoScore).reduce((a, b) => a + b, 0) / (score.length)
        });
      } else {
        this.isFormSubmitted = false;
      }
    }
  }

  getProjectsList(): void {
    if (!this.eqsApplicationId) { return; }
    this.showLoader = true;
    this.permitSectionService.getPermitSectionDetails('GetProjectDetailsList', this.eqsApplicationId)
      .subscribe((projectDetails: any) => {
        if (projectDetails) {
          this.showLoader = false;
          if (projectDetails && projectDetails.responseCode === AppConstants.APIResponseCodes.success) {
            this.projectDetails = projectDetails.result;
          }
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  getTechnicalTeamsList(): void {
    if (!this.eqsApplicationId) { return; }
    this.showLoader = true;
    const data = { EQSApplicationId: this.eqsApplicationId, GetLastApprovedTeamDetails: false };
    this.permitSectionService.getResourceTechnicalDetails('GetTechnicalTeamsDetailsList', data)
      .subscribe((technicalteamDetails: any) => {
        this.showLoader = false;
        if (technicalteamDetails && technicalteamDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.technicalTeamsDetails = technicalteamDetails.result;
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  getIntegrationtechnicalteamDetails(): void {
    if (!this.eqsApplicationId) {
      return;
    }
    this.showLoader = true;
    this.permitSectionService.getTechnicalDetails('GetTechnicalTeamsDetailsIntegrationList', this.eqsApplicationId)
      .subscribe((integrationchnicalteamDetails: any) => {
        this.showLoader = false;
        if (integrationchnicalteamDetails) {
          if (integrationchnicalteamDetails && integrationchnicalteamDetails.responseCode === AppConstants.APIResponseCodes.success) {
            this.technicalTeamsintegrationDetails = integrationchnicalteamDetails.result;
          }
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  getfieldWorkList(): void {
    if (!this.eqsApplicationId) { return; }
    this.showLoader = true;
    this.permitSectionService.getPermitSectionDetails('GetFieldsOfWorkDetailsList', this.eqsApplicationId)
      .subscribe((approvedECOFieldWorkDetailsList: any) => {
        this.showLoader = false;
        if (approvedECOFieldWorkDetailsList) {
          if (approvedECOFieldWorkDetailsList && approvedECOFieldWorkDetailsList.responseCode === AppConstants.APIResponseCodes.success) {
            this.fieldWorkDetails = approvedECOFieldWorkDetailsList.result;
          }
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  showViewFieldsOfWorkPopUp(fieldworkid: number): void {
    this.viewFieldsOfWorkComponent.getFieldsOfWorkDetails(fieldworkid, this.isPermitSectionReadOnly);
    this.displayFieldsOfWorkPopUp = !this.displayFieldsOfWorkPopUp;
  }

  closeViewFieldsOfWorkPopUp(response: any): void {
    this.displayFieldsOfWorkPopUp = false;
    if (response && this.informationComponnet) {
      this.resposnseget(response, 2);
    }
  }

  resposnseget(response: any, gridIndex: number): void {
    if (response.responseCode === AppConstants.APIResponseCodes.success) {
      this.showLoader = false;
      this.loadRequiredgrid(gridIndex);
      this.informationComponnet.transformMessaages([{ message: 'Saved Successfully' }]);
      this.displayInformationPopUp = true;
    } else if ((this.informationComponnet && response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
      response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponnet)) {
      this.informationComponnet.transformMessaages(response.errorMessages);
      this.displayInformationPopUp = true;
      this.showLoadingIndicator = false;
    } else {
      this.informationComponnet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
      this.displayInformationPopUp = true;
    }
  }

  loadRequiredgrid(gridIndex) {
    switch (gridIndex) {
      case 0:
        this.getProjectsList();
        break;
      case 1:
        this.getTechnicalTeamsList();
        break;
      case 2:
        this.getfieldWorkList();
        break;
      case 3:
        this.getFacilities();
        break;
      case 4:
        this.getRemarks();
        break;
      case 5:
        this.getIntegrationtechnicalteamDetails();
        break;
      case 6:
        this.isPermitSectionReadOnly = true;
        this.getPermitSectionDetails(this.iDataTransferBetweenPages, this.isPermitSectionReadOnly);
        this.getFacilitiesrDetails.next();
        break;
    }
  }

  setValidationRestrictedtype() {
    this.isFormSubmitted = false;
    if (this.isrestrictOffice.value) {
      this.restrictTypeId.setValidators([Validators.required]);
      this.restrictTypeId.updateValueAndValidity();
      this.reasonForRestricting.setValidators([Validators.required]);
      this.reasonForRestricting.updateValueAndValidity();
    } else {
      this.restrictTypeId.clearValidators();
      this.restrictTypeId.updateValueAndValidity();
      this.reasonForRestricting.clearValidators();
      this.reasonForRestricting.updateValueAndValidity();
      this.restrictTypeId.reset();
      this.reasonForRestricting.reset();
    }
  }

  showViewTeamDetailsPopUp(technicalTeamsDetailsId: number, ispreviousReadonly?: boolean): void {
    this.viewTechnicalTeamDetailsComponent.getTechnicalTeamDetails(technicalTeamsDetailsId, ispreviousReadonly);
    this.displayTeamDetailsPopUp = !this.displayTeamDetailsPopUp;
  }

  closeViewTeamDetailsPopUp(response: any): void {
    this.displayTeamDetailsPopUp = false;
    if (this.informationComponnet) {
      this.resposnseget(response, 1);
    }
  }

  closeInformationPopUp(): void {
    this.displayInformationPopUp = false;
  }

  showViewProjectDetailsPopUp(projectDetailsId: number): void {
    this.viewProjectDetailsComponent.getProjectDetails(projectDetailsId, this.isPermitSectionReadOnly);
    this.displayProjectDetailsPopUp = !this.displayProjectDetailsPopUp;
  }

  closeProjectDetailsPopUp(response: any): void {
    this.displayProjectDetailsPopUp = false;
    if (this.informationComponnet) {
      this.resposnseget(response, 0);
    }
  }

  showAddViewRemarksPopUp(): void {
    this.displayAddViewRemarksPopUp = !this.displayAddViewRemarksPopUp;
    this.addViewRemarksComponent.getMasterRemarks(this.eqsApplicationId);
  }

  closeAddViewRemarksPopUp(): void {
    this.displayAddViewRemarksPopUp = false;
    this.getRemarks();
  }

  showViewApplocationHistoryPopUp(taskHistoryId?: number): void {
    this.viewTaskHistoryComponent.getTaskHistoryData(taskHistoryId);
    this.displayViewTaskHistoryPopUp = !this.displayViewTaskHistoryPopUp;
  }

  closeViewTaskHistoryPopUp(): void {
    this.displayViewTaskHistoryPopUp = false;
    this.getFacilities();
  }

  private createPermitSectionForm(): void {
    this.permitSectionFromGroup = new FormGroup({
      fromDate: new FormControl('', null),
      toDate: new FormControl('', null),
      consider: new FormControl('', null),
      eCOScore: new FormControl('', null),
      eCOClass: new FormControl('', null),
      eCOClassId: new FormControl('', Validators.required),
      newRemarks: new FormControl('', null),
      averageECOScrore: new FormControl('', null),
    });
  }

  private createPermitSectionRecommandationForm(): void {
    this.permitSectionRecommandationFromGroup = new FormGroup({
      isrestrictOffice: new FormControl('', null),
      isrestrictOfficeText: new FormControl('', null),
      restrictTypeId: new FormControl('', null),
      restrictType: new FormControl('', null),
      internalComments: new FormControl('', null),
      externalComments: new FormControl('', null),
      delayJustification: new FormControl('', null),
      recommendedAction: new FormControl('', Validators.required),
      reasonForRestricting: new FormControl('', null),
      previousApplicationNmber: new FormControl('', null),
      isDelayed: new FormControl('', null),
      status: new FormControl('', null),
    });
  }
}
