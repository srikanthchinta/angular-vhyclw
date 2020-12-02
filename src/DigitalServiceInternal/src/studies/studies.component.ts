import { iAddViewRequestForAssistance } from './../add-view-request-for-assistance/add-view-request-for-assistance';
import { HelperService } from './../../common/helper.service';
import { StudiesService } from './studies.services';
import { iDropdown, AppConstants } from './../../constants/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddViewRequestForAssistanceComponent } from '../add-view-request-for-assistance/add-view-request-for-assistance.component';
import { ViewUploadedStudiesReportsDetailsComponent } from '../view-uploaded-studies-reports-details/view-uploaded-studies-reports-details.component';
import { ViewTaskHistoryComponent } from '../view-task-history/view-task-history.component';
import { RequestAndReviewFormComponent } from '../request-and-review-form/request-and-review-form.component';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { iStudiesRecommendation } from './studies';
import * as fileSaver from 'file-saver';
import { UtilService } from 'digital-services-library';
import { InformationDialogComponent } from '../../shared/information-dialog/information-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'eqs-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
  studiesFormGroup: FormGroup;
  displayRequestForAssistancePopUp: boolean;
  displayUploadedStudiesReportsPopUp: boolean;
  displayTaskHistoryPopUp: boolean;
  displayRequestAndReviewFormPopUp: boolean;
  isFormSubmitted: boolean;
  studyTypes: iDropdown[];
  recommendedActions: iDropdown[];
  gridPageSize = AppConstants.eqsGridPageSize;
  first = 0;
  internalForms: any;
  requestForAssistance: any;
  taskHistory: any;
  submittedStudyHistory: any;
  studies: any;
  iAddViewRequestForAssistance: iAddViewRequestForAssistance;
  maxFileUploadSize: number;
  fileTypesToAllowUpload: string;
  maxFileSizeAllowedInfo: string;
  allowedFileTypesInfo: string;
  uploadFileLabel: string;
  fileChoose: string;
  fileUpload: string;
  fileDelete: string;
  fileChooseInfo: string;
  technicalReviewFormFileChooseInfo: string;
  displayDateFormat: string = AppConstants.displayDateFormat;
  isStudiesReadOnly: boolean;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  iStudiesRecommendation: iStudiesRecommendation;
  showLoader: boolean;
  technicalReviewForm: any;
  technicalTemplateRequired: boolean;
  technicalTemplateToBeUploaded: number;
  technicalTemplatesToBeUploaded: boolean;
  evaluationSheet: any;
  evaluationSheetRequired: boolean;
  evaluationDocumentToBeUploaded: number;
  evaluationDocumentsToBeUploaded: boolean;
  displayInformationPopUp: boolean;
  requestForAssistanceId: number;
  displayConfirmationPopUp: boolean;
  isAllowedActionReadOnly: boolean;
  studyAndReportUploadId: number;
  formName: string;
  shouldAllowOnlyNumbers = new RegExp('^[0-9]$');
  studiesAllowedActions: any;
  allowedActions: any;
  @ViewChild(AddViewRequestForAssistanceComponent, null) addViewRequestForAssistanceComponent: AddViewRequestForAssistanceComponent;
  @ViewChild(ViewUploadedStudiesReportsDetailsComponent, null)
  viewUploadedStudiesReportsDetailsComponent: ViewUploadedStudiesReportsDetailsComponent;
  @ViewChild(ViewTaskHistoryComponent, null) viewTaskHistoryComponent: ViewTaskHistoryComponent;
  @ViewChild(RequestAndReviewFormComponent, null) requestAndReviewFormComponent: RequestAndReviewFormComponent;
  @ViewChild(InformationDialogComponent, null) informationComponet: InformationDialogComponent;
  @ViewChild(ConfirmationDialogComponent, null) confirmationComponent: ConfirmationDialogComponent;
  constructor(private studiesService: StudiesService, private helperService: HelperService, private utilService: UtilService) { }

  ngOnInit() {
    this.onPageLoad();
  }

  get companyName() {
    return this.studiesFormGroup.get('companyName');
  }

  get enableStudyScore() {
    return this.studiesFormGroup.get('enableStudyScore');
  }

  get studyScore() {
    return this.studiesFormGroup.get('studyScore');
  }

  get additionalStudyRequired() {
    return this.studiesFormGroup.get('additionalStudyRequired');
  }

  get study() {
    return this.studiesFormGroup.get('study');
  }

  get studyTypeId() {
    return this.studiesFormGroup.get('studyTypeId');
  }

  get internalComments() {
    return this.studiesFormGroup.get('internalComments');
  }

  get externalComments() {
    return this.studiesFormGroup.get('externalComments');
  }

  get delayJustification() {
    return this.studiesFormGroup.get('delayJustification');
  }

  get recommendedActionId() {
    return this.studiesFormGroup.get('recommendedActionId');
  }

  get isDelayed() {
    return this.studiesFormGroup.get('isDelayed');
  }

  get status() {
    return this.studiesFormGroup.get('status');
  }

  get studyType() {
    return this.studiesFormGroup.get('studyType');
  }

  get recommendation() {
    return this.studiesFormGroup.get('recommendation');
  }

  get evaluationSheetDocumentId() {
    return this.studiesFormGroup.get('evaluationSheetDocumentId');
  }

  get evaluationSheetFileName() {
    return this.studiesFormGroup.get('evaluationSheetFileName');
  }

  get annextureADocumentId() {
    return this.studiesFormGroup.get('annextureADocumentId');
  }

  get annextureAFileName() {
    return this.studiesFormGroup.get('annextureAFileName');
  }

  private onPageLoad(): void {
    this.createStudiesForm();
  }

  private inilizePageDefaultValues(): void {
    this.evaluationSheet = [];
    this.technicalReviewForm = [];
    this.technicalTemplateRequired = false;
    this.technicalTemplatesToBeUploaded = false;
    this.technicalTemplateToBeUploaded = 0;
    this.evaluationSheetRequired = false;
    this.evaluationDocumentsToBeUploaded = false;
    this.evaluationDocumentToBeUploaded = 0;
    this.isStudiesReadOnly = false;
    this.displayRequestForAssistancePopUp = false;
    this.displayTaskHistoryPopUp = false;
    this.displayRequestAndReviewFormPopUp = false;
    this.isFormSubmitted = false;
    this.maxFileUploadSize = AppConstants.eqsMaxFileUploadSize;
    this.fileTypesToAllowUpload = AppConstants.eqsFileTypesToAllowUpload;
    this.displayInformationPopUp = false;
    this.isAllowedActionReadOnly = true;
    this.delayJustification.reset();
    this.recommendedActionId.reset();
    this.studiesFormGroup.patchValue({
      enableStudyScore: true
    });
  }

  getLabelDispalyText(): void {
    this.uploadFileLabel = this.utilService.getDisplayText('Common.fileUpload');
    this.fileChoose = this.utilService.getDisplayText('Common.fileChoose');
    this.fileUpload = this.utilService.getDisplayText('Common.fileUpload');
    this.fileDelete = this.utilService.getDisplayText('Common.fileDeleteAll');
    this.fileChooseInfo = this.utilService.getDisplayText('Common.fileChooseInfo')
      .replace('{0}', AppConstants.eqsFileTypesToAllowUpload).replace('{1}', String((AppConstants.eqsMaxFileUploadSize) / 1048576));
    this.technicalReviewFormFileChooseInfo = this.utilService.getDisplayText('Common.fileChooseInfo')
      .replace('{0}', '.PDF').replace('{1}', String((AppConstants.eqsMaxFileUploadSize) / 1048576));
    this.maxFileSizeAllowedInfo = this.utilService.getDisplayText('Common.maxFileSizeAllowed');
    this.allowedFileTypesInfo = this.utilService.getDisplayText('Common.allowedFileTypes');
  }

  uploadEvaluationSheet(event: any): void {
    this.evaluationSheet = [];
    for (const file of event.files) {
      this.evaluationSheet.push(file);
    }
    this.evaluationDocumentToBeUploaded = 0;
    this.evaluationDocumentsToBeUploaded = false;
  }

  removeEvaluationSheet(event: any): void {
    if (event) {
      this.evaluationDocumentToBeUploaded -= 1;
      this.evaluationDocumentsToBeUploaded = false;
    }

    this.evaluationSheet.forEach((item, index) => {
      if (item.name === event.file.name) {
        this.evaluationSheet.splice(index, 1);
      }
    });
  }

  removeAllUploadedEvaluationSheets(): void {
    this.evaluationSheet = [];
    this.evaluationDocumentToBeUploaded = 0;
    this.evaluationDocumentsToBeUploaded = false;
  }

  selectEvaluationDocumentToUpload(): void {
    this.evaluationDocumentToBeUploaded += 1;
    this.evaluationSheetRequired = false;
  }

  uploadTechnicalReviewForm(event: any): void {
    this.technicalReviewForm = [];
    for (const file of event.files) {
      this.technicalReviewForm.push(file);
    }
    this.technicalTemplateToBeUploaded = 0;
    this.technicalTemplatesToBeUploaded = false;
  }

  removeTechnicalTechnicalReviewForm(event: any): void {
    if (event) {
      this.technicalTemplateToBeUploaded -= 1;
      this.technicalTemplatesToBeUploaded = false;
    }

    this.technicalReviewForm.forEach((item, index) => {
      if (item.name === event.file.name) {
        this.technicalReviewForm.splice(index, 1);
      }
    });
  }

  removeAllUploadedTechnicalReviewForms(): void {
    this.technicalReviewForm = [];
    this.technicalTemplateToBeUploaded = 0;
    this.technicalTemplatesToBeUploaded = false;
  }

  selectTechnicalDocumentToUpload(): void {
    this.technicalTemplateToBeUploaded += 1;
    this.technicalTemplateRequired = false;
  }

  getStudiesPageDetails(dataTransferBetweenPages: iDataTransferBetweenPages): void {
    this.showLoader = true;
    this.iDataTransferBetweenPages = dataTransferBetweenPages;
    this.iDataTransferBetweenPages.dataClassificationTypeId = AppConstants.dataClassificationTypes.studies;
    const eqsIdDTO = {
      eQSApplicationId: this.iDataTransferBetweenPages.id, studyAndReportUploadId: this.iDataTransferBetweenPages.requestId,
      dataClassificationTypeId: this.iDataTransferBetweenPages.dataClassificationTypeId
    };
    this.studiesService.getStudiesPageDetails('GetStudiesSectionDetails', eqsIdDTO)
      .subscribe((response: any) => {
        if (response && this.informationComponet && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.inilizePageDefaultValues();
          this.getLabelDispalyText();
          this.studies = response.studies;
          this.submittedStudyHistory = response.studyHistory;
          this.requestForAssistance = response.requestForAssistance;
          this.taskHistory = response.applicationStatusHistory;
          this.internalForms = response.internalForms;
          this.setRecommendationSectionDeatils(response.studyOrReportRecommendationDetails);
          this.showLoader = false;
        } else if (response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) {
          this.informationComponet.transformMessaages(response.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoader = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  private setRecommendationSectionDeatils(recommendationSectionDetails: any): void {
    if (!recommendationSectionDetails) {
      this.isStudiesReadOnly = true;
      return;
    }
    let studyTypeText: string;
    this.studyAndReportUploadId = recommendationSectionDetails.studyAndReportUploadId;
    this.isStudiesReadOnly = recommendationSectionDetails.isStudyOrReportReadOnly;
    this.isAllowedActionReadOnly = recommendationSectionDetails.isAllowedActionReadOnly;
    this.studiesAllowedActions = recommendationSectionDetails.studiesAllowedActions;
    this.allowedActions = recommendationSectionDetails.allowedActions;
    this.studiesFormGroup.patchValue({
      companyName: recommendationSectionDetails.ecoCompanyName,
      enableStudyScore: recommendationSectionDetails.isEnableStudyScore,
      studyScore: recommendationSectionDetails.studyScore,
      additionalStudyRequired: recommendationSectionDetails.isAdditionalStudyRequired,
      isDelayed: recommendationSectionDetails.isDelayed,
      internalComments: recommendationSectionDetails.internalComments,
      externalComments: recommendationSectionDetails.externalComments,
      status: recommendationSectionDetails.status,
      studyTypeId: (recommendationSectionDetails.studyTypeId) ? String(recommendationSectionDetails.studyTypeId) : this.studyTypeId.value,
      study: recommendationSectionDetails.studyOrReportName,
      evaluationSheetDocumentId: recommendationSectionDetails.evaluationSheetDocumentId,
      evaluationSheetFileName: recommendationSectionDetails.evaluationSheet,
      annextureADocumentId: recommendationSectionDetails.annextureADocumentId,
      annextureAFileName: recommendationSectionDetails.annextureAFileName
    });
    this.recommendedActions = (this.additionalStudyRequired.value) ?
      this.helperService.prepareDropDownData(this.studiesAllowedActions) :
      this.helperService.prepareDropDownData(this.allowedActions);
    this.studyTypes = this.helperService.prepareDropDownData(recommendationSectionDetails.studyTypes);
    if (this.isDelayed.value) {
      this.delayJustification.setValidators([Validators.required]);
      this.delayJustification.updateValueAndValidity();
    }
    if (this.isStudiesReadOnly) {
      this.studyTypes.filter((studyType) => Number(studyType.value) === recommendationSectionDetails.studyTypeId).forEach((result) => {
        studyTypeText = result.label;
      });
      this.studiesFormGroup.patchValue({
        studyType: studyTypeText
      });
    }
    this.setAdditionalStudyRequired();
  }

  setAdditionalStudyRequired() {
    if (this.additionalStudyRequired.value && !this.isStudiesReadOnly) {
      this.studyTypeId.setValidators([Validators.required]);
      this.studyTypeId.updateValueAndValidity();
    } else {
      this.studyTypeId.clearValidators();
      this.studyTypeId.updateValueAndValidity();
    }
    this.studiesFormGroup.patchValue({
      recommendedActionId: null
    });
    this.recommendedActions = (this.additionalStudyRequired.value) ?
      this.helperService.prepareDropDownData(this.studiesAllowedActions) :
      this.helperService.prepareDropDownData(this.allowedActions);
  }

  addRequestForAssistance(rowData: { studyAndReportId: any; }): void {
    this.iAddViewRequestForAssistance = {
      requestForAssistanceId: rowData.studyAndReportId,
      eQSApplicationId: this.iDataTransferBetweenPages.id,
      dataClassificationTypeId: this.iDataTransferBetweenPages.dataClassificationTypeId,
      isRequestor: true, isWithDraw: false
    };

    if (this.addViewRequestForAssistanceComponent) {
      this.addViewRequestForAssistanceComponent.viewRequestForAssistance(this.iAddViewRequestForAssistance);
      this.displayRequestForAssistancePopUp = !this.displayRequestForAssistancePopUp;
    }
  }

  withdrawRequestForAssistance(rowData: { id: any; }): void {
    const withdrawConfirmationText = this.utilService.getDisplayText('Common.withdrawConfirmationText');
    this.requestForAssistanceId = rowData.id;
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

  loadRequestForAssistanceDetails(isSMEOpted?: string): void {
    this.showLoader = true;
    this.displayRequestForAssistancePopUp = false;
    this.studiesService.loadRequestForAssistanceDetails('AssistanceRequestSelect', this.iDataTransferBetweenPages)
      .subscribe((requestForAssistanceDetails: any) => {
        if (requestForAssistanceDetails && requestForAssistanceDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.requestForAssistance = requestForAssistanceDetails.result;
          this.showLoader = false;
        } else {
          console.error(requestForAssistanceDetails);
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  getSubmittedStudyHistory(rowData: { studyAndReportId: any; }): void {
    if (!rowData) {
      return;
    }
    this.showLoader = true;
    const eqsIdDTO = {
      eQSApplicationId: this.iDataTransferBetweenPages.id, studyAndReportId: rowData.studyAndReportId,
      dataClassificationTypeId: this.iDataTransferBetweenPages.dataClassificationTypeId
    };
    this.studiesService.getSubmittedStudyHistory('GetStudyOrReportHistory', eqsIdDTO)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.submittedStudyHistory = response.studiesOrReports;
          this.taskHistory = response.applicationStatusHistory;
          this.requestForAssistance = response.requestForAssistance;
          this.setRecommendationSectionDeatils(response.studyOrReportRecommendationDetails);
          this.showLoader = false;
        } else {
          console.error(response);
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  viewUploadedStudyPopUp(rowData: { studyAndReportUploadId: number; }): void {
    if (this.viewUploadedStudiesReportsDetailsComponent) {
      this.viewUploadedStudiesReportsDetailsComponent.getUploadedStudyReportsDetails(rowData.studyAndReportUploadId);
      this.displayUploadedStudiesReportsPopUp = true;
    }
  }

  closeUploadedStudyPopUp(): void {
    this.displayUploadedStudiesReportsPopUp = false;
  }

  enableStudyScoreSelected(): void {
    this.evaluationSheetRequired = false;
    this.studyScore.setValue(null);
  }

  closeRequestForAssistancePopUp(): void {
    this.displayRequestForAssistancePopUp = false;
  }

  closeConfirmationPopUp(confirmed: boolean): void {
    if (confirmed) {
      this.displayConfirmationPopUp = false;
      if (this.requestForAssistanceId !== 0 && this.addViewRequestForAssistanceComponent) {
        this.iAddViewRequestForAssistance = {
          eQSApplicationId: this.iDataTransferBetweenPages.id, requestForAssistanceId: this.requestForAssistanceId,
          isRequestor: false, isWithDraw: true
        };
        this.addViewRequestForAssistanceComponent.viewRequestForAssistance(this.iAddViewRequestForAssistance);
        this.displayRequestForAssistancePopUp = !this.displayRequestForAssistancePopUp;
      }
    } else {
      this.displayConfirmationPopUp = false;
    }
  }

  saveStudyDetails(): void {
    if (!this.isStudiesReadOnly) {
      if (this.enableStudyScore.value && this.evaluationDocumentToBeUploaded > 0) {
        this.evaluationDocumentsToBeUploaded = true;
        return;
      }
      if (this.enableStudyScore.value && this.evaluationSheet.length === 0) {
        this.evaluationSheetRequired = true;
        return;
      }

      if (this.technicalTemplateToBeUploaded > 0) {
        this.technicalTemplatesToBeUploaded = true;
        return;
      }
      if (this.technicalReviewForm.length === 0) {
        this.technicalTemplateRequired = true;
        return;
      }
      if (this.studyScore.value > 100) {
        this.studyScore.markAsDirty();
      }
    }
    this.isFormSubmitted = false;
    this.displayInformationPopUp = false;
    if (!this.studiesFormGroup.valid) {
      this.isFormSubmitted = true;
      return;
    }
    if (!this.informationComponet) {
      return;
    }
    this.showLoader = true;
    const successMessage = this.utilService.getDisplayText('Common.submitedSuccessMessage');
    this.iStudiesRecommendation = {
      eqsApplicationId: this.iDataTransferBetweenPages.id,
      studyAndReportUploadId: this.studyAndReportUploadId,
      enableStudyScore: this.enableStudyScore.value,
      studyScore: Number(this.studyScore.value),
      isAdditionalStudyRequired: this.additionalStudyRequired.value,
      studyTypeId: Number(this.studyTypeId.value),
      internalComments: (this.internalComments.value) ? this.internalComments.value : '',
      externalComments: (this.externalComments.value) ? this.externalComments.value : '',
      delayJustification: (this.delayJustification.value) ? this.delayJustification.value : '',
      recommendedActionId: Number(this.recommendedActionId.value),
      technicalReviewForm: this.technicalReviewForm,
      evaluationSheet: this.evaluationSheet
    };
    this.studiesService.saveStudyDetails('ApplicationStudyAndReportRecommendation', this.iStudiesRecommendation)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.isStudiesReadOnly = true;
          this.showLoader = false;
          this.iDataTransferBetweenPages.requestId = response.result.studyAndReportUploadId;
          this.getStudiesPageDetails(this.iDataTransferBetweenPages);
          this.informationComponet.transformMessaages([{ message: successMessage }]);
          this.displayInformationPopUp = true;
        } else if (response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) {
          this.informationComponet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoader = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  closeInformationPopUp(): void {
    this.displayInformationPopUp = false;
  }

  viewTaskHistory(rowData: { statusHistoryId: number; }): void {
    if (rowData && this.viewTaskHistoryComponent) {
      this.displayTaskHistoryPopUp = !this.displayTaskHistoryPopUp;
      this.viewTaskHistoryComponent.getTaskHistoryDetails(rowData.statusHistoryId);
    }
  }

  closeTaskHistoryPopUp(): void {
    this.displayTaskHistoryPopUp = false;
  }

  viewRequestAndReviewFormPopUp(rowData: { internalFormId: number; formName: string }): void {
    if (rowData && this.requestAndReviewFormComponent) {
      this.requestAndReviewFormComponent.getRequestAndReviewFormDetails(this.iDataTransferBetweenPages.id, rowData.internalFormId);
      this.formName = rowData.formName;
      this.displayRequestAndReviewFormPopUp = !this.displayRequestAndReviewFormPopUp;
    }
  }

  closeRequestAndReviewPopUp(): void {
    this.displayRequestAndReviewFormPopUp = false;
  }

  downLoadTechnicalReviewTemplate(): void {
    if (!this.iDataTransferBetweenPages.requestId) {
      return;
    }
    this.showLoader = true;
    this.studiesService.downLoadTechnicalReviewTemplate('DownloadAttachmentATemplate', this.iDataTransferBetweenPages.requestId)
      .subscribe((technicalReviewTemplate) => {
        if (technicalReviewTemplate.size > 0) {
          fileSaver.saveAs(technicalReviewTemplate, 'TechnicalReviewTempalte.docx');
          this.showLoader = false;
        } else {
          this.informationComponet.transformMessaages([{ message: 'Template Not Found or Could not Generate' }],
            AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoader = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  downloadDocument(documentId: number, documentName: string): void {
    this.showLoader = true;
    this.studiesService.downloadDocument('ViewUploadedFile', documentId)
      .subscribe((technicalReviewTemplate) => {
        if (technicalReviewTemplate.size > 0) {
          fileSaver.saveAs(technicalReviewTemplate, documentName);
          this.showLoader = false;
        } else {
          this.informationComponet.transformMessaages([{ message: 'Template Not Found or Could not Generate' }],
            AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoader = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoader = false;
      });
  }

  private createStudiesForm(): void {
    this.studiesFormGroup = new FormGroup({
      companyName: new FormControl('', null),
      enableStudyScore: new FormControl('', null),
      studyScore: new FormControl('', [Validators.min(0), Validators.max(100)]),
      additionalStudyRequired: new FormControl('', null),
      study: new FormControl('', null),
      studyTypeId: new FormControl('', Validators.required),
      internalComments: new FormControl('', null),
      externalComments: new FormControl('', null),
      delayJustification: new FormControl('', null),
      isDelayed: new FormControl('', null),
      recommendedActionId: new FormControl('', Validators.required),
      status: new FormControl('', null),
      studyType: new FormControl('', null),
      recommendation: new FormControl('', null),
      evaluationSheetDocumentId: new FormControl('', null),
      evaluationSheetFileName: new FormControl('', null),
      annextureADocumentId: new FormControl('', null),
      annextureAFileName: new FormControl('', null)
    });
  }
}
