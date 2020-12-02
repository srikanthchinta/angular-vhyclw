import { ConfirmationDialogComponent } from './../../shared/confirmation-dialog/confirmation-dialog.component';
import { UtilService } from 'digital-services-library';
import { iAddViewRequestForAssistance } from './../add-view-request-for-assistance/add-view-request-for-assistance';
import { HelperService } from '../../common/helper.service';
import { iDropdown, AppConstants } from './../../constants/constants';
import { PermitSectionService } from './permit-section.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddViewRequestForAssistanceComponent } from '../add-view-request-for-assistance/add-view-request-for-assistance.component';
import { ViewTaskHistoryComponent } from '../view-task-history/view-task-history.component';
import { iPermitSectionRecommendation } from './permit-section';
import { InformationDialogComponent } from '../../shared/information-dialog/information-dialog.component';
import { AddViewPermitConditionsComponent } from '../add-view-permit-conditions/add-view-permit-conditions.component';
import { AddViewFacilityProjectClassComponent } from '../add-view-facility-project-class/add-view-facility-project-class.component';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
@Component({
  selector: 'eqs-permit-section',
  templateUrl: './permit-section.component.html',
  styleUrls: ['./permit-section.component.scss']
})
export class PermitSectionComponent implements OnInit {
  permitSectionFormGroup: FormGroup;
  displayRequestForAssistancePopUp: boolean;
  displayPermitConditionsPopUp: boolean;
  displayFacilityProjectClassPopUp: boolean;
  displayTaskHistoryPopUp: boolean;
  isFormSubmitted: boolean;
  studyRequredOptions: iDropdown[];
  studies: iDropdown[];
  recommendedActionOptions: iDropdown[];
  requestForAssistance: any;
  permitConditions: any[];
  facilityProjectClassDetails: any;
  taskHistory: any;
  gridPageSize = AppConstants.eqsGridPageSize;
  faciliityProjectGridFirstPage = 0;
  requestForAssistanceGridFirstPage = 0;
  permitConditionsGirdFirstPage = 0;
  taskHistoryGridFirstPage = 0;
  displayDateFormat = AppConstants.displayDateFormat;
  statusHstoryId: number;
  showLoader: boolean;
  displayInformationPopUp: boolean;
  displayConfirmationPopUp: boolean;
  isPermitSectionReadOnly: boolean;
  isAllowedActionReadOnly: boolean;
  iPermitSectionRecommendation: iPermitSectionRecommendation;
  iAddViewRequestForAssistance: iAddViewRequestForAssistance;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  canShowAddFacilityProjectClassButton: boolean;
  confirmationActionUniqueId: number;
  confirmationCallBackMethodId: number;
  studiesAllowedActions: any;
  allowedActions: any;
  @ViewChild(AddViewRequestForAssistanceComponent, null) addViewRequestForAssistanceComponent: AddViewRequestForAssistanceComponent;
  @ViewChild(ViewTaskHistoryComponent, null) viewTaskHistoryComponent: ViewTaskHistoryComponent;
  @ViewChild(InformationDialogComponent, null) informationComponet: InformationDialogComponent;
  @ViewChild(ConfirmationDialogComponent, null) confirmationComponent: ConfirmationDialogComponent;
  @ViewChild(AddViewPermitConditionsComponent, null) addViewPermitConditionsComponent: AddViewPermitConditionsComponent;
  @ViewChild(AddViewFacilityProjectClassComponent, null) addViewFacilityProjectClassComponent: AddViewFacilityProjectClassComponent;
  constructor(private permitSectionService: PermitSectionService, private helperService: HelperService,
              private utilService: UtilService) { }

  ngOnInit() {
    this.onPageLoad();
  }

  get studyRequired() {
    return this.permitSectionFormGroup.get('studyRequired');
  }

  get studyId() {
    return this.permitSectionFormGroup.get('studyId');
  }

  get internalComments() {
    return this.permitSectionFormGroup.get('internalComments');
  }

  get externalComments() {
    return this.permitSectionFormGroup.get('externalComments');
  }

  get delayJustification() {
    return this.permitSectionFormGroup.get('delayJustification');
  }

  get isSMERequested() {
    return this.permitSectionFormGroup.get('isSMERequested');
  }

  get recommendedActionId() {
    return this.permitSectionFormGroup.get('recommendedActionId');
  }

  get isDelayed() {
    return this.permitSectionFormGroup.get('isDelayed');
  }

  get status() {
    return this.permitSectionFormGroup.get('status');
  }

  get study() {
    return this.permitSectionFormGroup.get('study');
  }

  get studyRequested() {
    return this.permitSectionFormGroup.get('studyRequested');
  }

  private onPageLoad() {
    this.createPermitSectionForm();
    this.initilizeDefaultValues();
  }

  private initilizeDefaultValues() {
    this.displayInformationPopUp = false;
    this.displayConfirmationPopUp = false;
    this.isFormSubmitted = false;
    this.displayRequestForAssistancePopUp = false;
    this.displayPermitConditionsPopUp = false;
    this.displayTaskHistoryPopUp = false;
    this.showLoader = false;
    this.canShowAddFacilityProjectClassButton = false;
    this.isPermitSectionReadOnly = false;
    this.isAllowedActionReadOnly = false;
  }

  private setPermitSectionDetails(permitSectionDetails: any): void {
    let studyName: string;
    this.facilityProjectClassDetails = permitSectionDetails.facilityProjectClassDetails;
    this.requestForAssistance = permitSectionDetails.requestForAssistance;
    this.taskHistory = permitSectionDetails.applicationStatusHistory;
    this.permitConditions = permitSectionDetails.applicationPermitConditions;
    this.studyRequredOptions = this.helperService.prepareDropDownData(permitSectionDetails.booleanValues);
    this.studies = this.helperService.prepareDropDownData(permitSectionDetails.studies);
    this.studiesAllowedActions = permitSectionDetails.studiesAllowedActions;
    this.allowedActions = permitSectionDetails.allowedActions;
    this.isAllowedActionReadOnly = permitSectionDetails.applicationRecommendation.isAllowedActionReadOnly;
    this.permitSectionFormGroup.patchValue({
      status: permitSectionDetails.applicationRecommendation.status,
      studyRequired: permitSectionDetails.applicationRecommendation.isStudyRequired,
      studyId: (permitSectionDetails.applicationRecommendation.studyTypeId) ?
        String(permitSectionDetails.applicationRecommendation.studyTypeId) : this.studyId.value,
      internalComments: '',
      externalComments: permitSectionDetails.applicationRecommendation.extrenalComments,
      isDelayed: permitSectionDetails.applicationRecommendation.isDelayed,
      isSMERequested: (permitSectionDetails.applicationRecommendation.isSMEAssistanceRequested) ?
        this.utilService.getDisplayText('Common.yes') : this.utilService.getDisplayText('Common.no')
    });
    this.recommendedActionOptions = (this.studyRequired.value) ?
      this.helperService.prepareDropDownData(this.studiesAllowedActions) :
      this.helperService.prepareDropDownData(this.allowedActions);
    if (this.isPermitSectionReadOnly) {
      this.canShowAddFacilityProjectClassButton = false;
      this.studies.filter((study) =>
        Number(study.value) === permitSectionDetails.applicationRecommendation.studyTypeId).forEach((result) => {
          studyName = result.label;
        });
      this.permitSectionFormGroup.patchValue({
        studyRequested: (this.studyRequired.value) ?
          this.utilService.getDisplayText('Common.yes') : this.utilService.getDisplayText('Common.no'),
        study: studyName
      });
    }
    if (!this.isPermitSectionReadOnly) {
      if (this.isDelayed.value) {
        this.delayJustification.setValidators([Validators.required]);
      }
      this.canAddFacilityProjectClass();
      if (this.studyRequired.value) {
        this.setStudyRequired();
      }
    }
  }

  private canAddFacilityProjectClass(): void {
    if (this.facilityProjectClassDetails.length === 0) {
      this.canShowAddFacilityProjectClassButton = true;
    } else {
      this.facilityProjectClassDetails
        .filter((facilityProjectClass: { eqsApplicationId: number; }) => {
          this.canShowAddFacilityProjectClassButton = (facilityProjectClass.eqsApplicationId !== this.iDataTransferBetweenPages.id);
        });
    }
  }

  setStudyRequired() {
    if (this.studyRequired.value) {
      this.studyId.setValidators([Validators.required]);
      this.studyId.updateValueAndValidity();
    } else {
      this.studyId.clearValidators();
      this.studyId.updateValueAndValidity();
    }
    this.permitSectionFormGroup.patchValue({
      recommendedActionId: null
    });
    this.recommendedActionOptions = (this.studyRequired.value) ?
      this.helperService.prepareDropDownData(this.studiesAllowedActions) :
      this.helperService.prepareDropDownData(this.allowedActions);
  }

  updatePermitConditionStatus(rowData: { isActive: any; permitConditionId: number; }): void {
    if (!rowData) {
      return;
    }
    const confirmationText = ((!rowData.isActive) ?
      this.utilService.getDisplayText('Common.activeRecord') : this.utilService.getDisplayText('Common.deactiveRecord'));
    this.confirmationActionUniqueId = rowData.permitConditionId;
    this.confirmationCallBackMethodId = 2;
    this.displayConfirmationPopUp = true;
    this.confirmationComponent.setConfirmationMessageText(confirmationText);
  }

  private changePermitConditionStatus() {
    if (this.confirmationActionUniqueId !== 0 && this.iDataTransferBetweenPages) {
      this.showLoader = true;
      this.permitSectionService.updatePermitConditionStatus('UpdateEQSApplicationPermitConditionActiveStatus',
        this.confirmationActionUniqueId, this.iDataTransferBetweenPages.id)
        .subscribe((response: any) => {
          if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
            this.getPermitConditionsDetails();
            this.showLoader = false;
          } else {
            console.error(response);
          }
        }, (error: any) => {
          console.error(error);
          this.showLoader = false;
        });
    }
  }

  getPermitConditionsDetails(): void {
    this.displayPermitConditionsPopUp = false;
    this.permitSectionService.getPermitSectionDetails('GetEQSApplicationPermitConditions', this.iDataTransferBetweenPages.id)
      .subscribe((permitConditions: any) => {
        if (permitConditions && permitConditions.responseCode === AppConstants.APIResponseCodes.success) {
          this.permitConditions = permitConditions.applicationPermitConditions;
        }
      }, (error: any) => {
        console.error(error);
      });
  }

  getPermitSectionDetails(dataTransferBetweenPages: iDataTransferBetweenPages, isPermitSectionReadOnly: boolean): void {
    this.showLoader = true;
    this.iDataTransferBetweenPages = dataTransferBetweenPages;
    this.iDataTransferBetweenPages.dataClassificationTypeId = AppConstants.dataClassificationTypes.application;
    this.isPermitSectionReadOnly = isPermitSectionReadOnly;
    this.permitSectionService.getPermitSectionDetails('GetPermitSectionDetails', this.iDataTransferBetweenPages.id)
      .subscribe((permitSectionDetails: any) => {
        if (permitSectionDetails && permitSectionDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.setPermitSectionDetails(permitSectionDetails);
          this.showLoader = false;
        }
      }, (error) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  saveRecommendationDetails(): void {
    this.displayInformationPopUp = false;
    this.isFormSubmitted = false;
    if (!this.permitSectionFormGroup.valid) {
      this.isFormSubmitted = true;
      return;
    }
    if (!this.informationComponet) {
      return;
    }
    this.showLoader = true;
    const successMessage = this.utilService.getDisplayText('Common.submitedSuccessMessage');
    this.isFormSubmitted = false;
    this.iPermitSectionRecommendation = {
      eQSApplicationId: this.iDataTransferBetweenPages.id,
      studyRequired: this.studyRequired.value,
      studyTypeId: (this.studyRequired.value) ? Number(this.studyId.value) : null,
      internalComments: this.internalComments.value, externalComments: this.externalComments.value,
      delayJustification: this.delayJustification.value, recommendedActionId: Number(this.recommendedActionId.value)
    };
    this.permitSectionService.saveRecommendationDetails('ApplicationRecommendation', this.iPermitSectionRecommendation)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.getPermitSectionDetails(this.iDataTransferBetweenPages, true);
          this.showLoader = false;
          this.informationComponet.transformMessaages([{ message: successMessage }]);
          this.displayInformationPopUp = true;
        } else if (response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) {
          this.informationComponet.transformMessaages(response.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoader = false;
        } else {
          this.informationComponet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  addRequestForAssistance(): void {
    this.iAddViewRequestForAssistance = {
      eQSApplicationId: this.iDataTransferBetweenPages.id,
      dataClassificationTypeId: this.iDataTransferBetweenPages.dataClassificationTypeId,
      isRequestor: true, isWithDraw: false,
    };

    if (this.addViewRequestForAssistanceComponent) {
      this.addViewRequestForAssistanceComponent.viewRequestForAssistance(this.iAddViewRequestForAssistance);
      this.displayRequestForAssistancePopUp = !this.displayRequestForAssistancePopUp;
    }
  }

  withdrawRequestForAssistance(rowData: { id: any; }): void {
    const withdrawConfirmationText = this.utilService.getDisplayText('Common.withdrawConfirmationText');
    this.confirmationActionUniqueId = rowData.id;
    this.confirmationCallBackMethodId = 1;
    this.displayConfirmationPopUp = true;
    this.confirmationComponent.setConfirmationMessageText(withdrawConfirmationText);
  }

  viewRequestForAssistance(rowData: { id: any; enableRespondentSection: any; }): void {
    if (rowData && this.addViewRequestForAssistanceComponent) {
      this.iAddViewRequestForAssistance = {
        eQSApplicationId: this.iDataTransferBetweenPages.id, requestForAssistanceId: rowData.id,
        isRequestor: false, isWithDraw: false,
        dataClassificationTypeId: this.iDataTransferBetweenPages.dataClassificationTypeId
      };
      this.addViewRequestForAssistanceComponent.viewRequestForAssistance(this.iAddViewRequestForAssistance);
      this.displayRequestForAssistancePopUp = !this.displayRequestForAssistancePopUp;
    }
  }

  closeRequestForAssistancePopUp(): void {
    this.displayRequestForAssistancePopUp = false;
  }

  loadRequestForAssistanceDetails(isSMEOpted?: string): void {
    this.showLoader = true;
    this.displayRequestForAssistancePopUp = false;
    this.permitSectionFormGroup.patchValue({
      isSMERequested: (isSMEOpted) ? isSMEOpted : ''
    });
    this.permitSectionService.loadRequestForAssistanceDetails('AssistanceRequestSelect', this.iDataTransferBetweenPages)
      .subscribe((requestForAssistanceDetails: any) => {
        if (requestForAssistanceDetails && requestForAssistanceDetails.responseCode === AppConstants.APIResponseCodes.success) {
          if (requestForAssistanceDetails.result) {
            this.requestForAssistance = requestForAssistanceDetails.result;
            this.showLoader = false;
          }
        } else {
          console.error(requestForAssistanceDetails);
          this.showLoader = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  showPermitConditionsPopUp(): void {
    if (this.addViewPermitConditionsComponent) {
      this.addViewPermitConditionsComponent.getPermitConditionDetails(this.iDataTransferBetweenPages.id);
      this.displayPermitConditionsPopUp = !this.displayPermitConditionsPopUp;
    }
  }

  closePermitConditionsPopUp(): void {
    this.displayPermitConditionsPopUp = false;
  }

  showFacilityProjectClassPopUp(isPopUpOpenForAdd: boolean = false): void {
    if (this.addViewFacilityProjectClassComponent) {
      this.addViewFacilityProjectClassComponent.getFacilityProjectClassFormDetails(this.iDataTransferBetweenPages.id, isPopUpOpenForAdd);
      this.displayFacilityProjectClassPopUp = !this.displayFacilityProjectClassPopUp;
    }
  }

  closeFacilityProjectClassPopUp(): void {
    this.displayFacilityProjectClassPopUp = false;
  }

  getFacilityProjectClassDetails(): void {
    this.showLoader = true;
    this.displayFacilityProjectClassPopUp = false;
    this.permitSectionService.getFacilityProjectClassDetails('GetEQSFacilityProjectClassDetails', this.iDataTransferBetweenPages.id)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.facilityProjectClassDetails = response.response;
          this.canAddFacilityProjectClass();
          this.showLoader = false;
        } else {
          console.error(response);
          this.showLoader = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  showTaskHistoryPopUp(rowData: { statusHistoryId: number; }): void {
    if (rowData && this.viewTaskHistoryComponent) {
      this.displayTaskHistoryPopUp = !this.displayTaskHistoryPopUp;
      this.viewTaskHistoryComponent.getTaskHistoryDetails(rowData.statusHistoryId);
    }
  }

  closeTaskHistoryPopUp(): void {
    this.displayTaskHistoryPopUp = false;
  }

  closeInformationPopUp(): void {
    this.displayInformationPopUp = false;
  }

  closeConfirmationPopUp(confirmed: boolean): void {
    if (confirmed && this.confirmationCallBackMethodId !== 0) {
      this.displayConfirmationPopUp = false;
      if (this.confirmationCallBackMethodId === 1) {
        this.withdrawAssistanceRequest();
      } else if (this.confirmationCallBackMethodId === 2) {
        this.changePermitConditionStatus();
      }
    } else {
      this.displayConfirmationPopUp = false;
    }
  }

  private withdrawAssistanceRequest() {
    if (this.confirmationActionUniqueId !== 0 && this.addViewRequestForAssistanceComponent) {
      this.iAddViewRequestForAssistance = {
        eQSApplicationId: this.iDataTransferBetweenPages.id, requestForAssistanceId: this.confirmationActionUniqueId,
        isRequestor: false, isWithDraw: true
      };
      this.addViewRequestForAssistanceComponent.viewRequestForAssistance(this.iAddViewRequestForAssistance);
      this.displayRequestForAssistancePopUp = !this.displayRequestForAssistancePopUp;
    }
  }

  private createPermitSectionForm(): void {
    this.permitSectionFormGroup = new FormGroup({
      studyRequired: new FormControl(''),
      studyRequested: new FormControl(''),
      studyId: new FormControl('', null),
      study: new FormControl('', null),
      internalComments: new FormControl('', null),
      externalComments: new FormControl('', null),
      isDelayed: new FormControl('', null),
      delayJustification: new FormControl('', null),
      isSMERequested: new FormControl('', null),
      recommendedActionId: new FormControl('', Validators.required),
      status: new FormControl('', null)
    });
  }
}
