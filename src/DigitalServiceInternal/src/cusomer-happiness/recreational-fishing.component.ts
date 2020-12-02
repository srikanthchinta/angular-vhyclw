import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { UtilService } from 'digital-services-library';
import { AppConstants } from '../../constants/constants';
import { SelectItem } from 'primeng/api';
import { RecreationalService } from '../recreational/recreational.service';
import * as fileSaver from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../common/helper.service';
@Component({
  selector: 'app-recreational',
  templateUrl: './recreational.component.html',
  styleUrls: ['./recreational.component.scss']
})
export class RecreationalComponent implements OnInit {
  applictionData: any;
  historyData: any;
  dispatchDropDown: SelectItem[];
  uploadedFiles: any;
  applictionRowData: boolean;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  displayDateFormat = AppConstants.displayDateFormat;
  displayDateFormatWithHHMM = AppConstants.displayDateFormatWithHHMM;
  minDate = new Date();
  maxDate = new Date();
  primeNgDateDisplayFormat = AppConstants.primeNgDateDisplayFormat;
  datePlaceHolderFormat = AppConstants.datePlaceHolderFormat;
  iStatusUpdate: iStatusUpdate;
  pageSize: number = AppConstants.gridPageSize;
  first = 0;
  isDisabled = false;
  displayDialog = false;
  applicationType: boolean;
  showLoadingIndicator: boolean;
  dispatchForm: FormGroup;
  submitted = false;
  constructor(private recreationalService: RecreationalService,
              private route: ActivatedRoute,
              private utilService: UtilService,
              private formBuilder: FormBuilder,
              private helperService: HelperService
  ) {
    this.route.queryParams.subscribe(params => {
      this.iDataTransferBetweenPages = this.utilService.getPageData();
    });
  }

  ngOnInit() {
    this.dispatchForm = this.formBuilder.group({
      dispatchDate: ['', Validators.required],
      dispatchVia: ['', Validators.required],
      trackingNumber: [''],
      comments: ['', Validators.required],
    });
    this.applictionRowData = false;
    this.isDisabled = false;
    this.applicationType = false;
    this.getApplicationDetails();
    this.helperService.subscription = this.helperService.languageChanged
      .subscribe(languageChanged => {
        if (languageChanged) {
          this.helperService.doDbCalls(false);
          this.getApplicationDetails();
        } else {
          this.getApplicationDetails();
        }
      });
  }

  get f() { return this.dispatchForm.controls; }
  getApplicationDetails() {
    if (this.iDataTransferBetweenPages !== undefined) {
      this.showLoadingIndicator = true;
      this.recreationalService.getApplicationNumberDetails('GetRFAApplicationDetails', this.iDataTransferBetweenPages.id)
        .subscribe((permitDetails: any) => {
          if (permitDetails !== undefined) {
            this.applictionData = permitDetails.rflApplicationDetails;
            this.historyData = permitDetails.rflStatusHistoryDetails;
            const defaultSelectText = this.utilService.getDisplayText('Common.select');
            let iDropdownObj: SelectItem;
            this.dispatchDropDown = [{ label: defaultSelectText, value: null }];
            for (const courierProvider of permitDetails.courierProviders) {
              iDropdownObj = { label: courierProvider.text, value: courierProvider.value };
              this.dispatchDropDown.push(iDropdownObj);
            }
            this.uploadedFiles = permitDetails.fileNames;
            this.applictionRowData = true;
            this.showLoadingIndicator = false;
            this.minDate = new Date(this.applictionData.issueDate);
            if (this.applictionData.enableApproved === false && this.applictionData.enableCardDispatched === false &&
              this.applictionData.enableCardPrinted === false && this.applictionData.enableClaim === false
              && this.applictionData.enableReClaim === false && this.applictionData.enableRequireMoreInfo === false
              && this.applictionData.enableRevokeClaim === false) {
              this.dispatchForm.get('comments').disable();
            } else {
              this.dispatchForm.get('comments').enable();
            }
            if (this.applictionData.subServiceId === AppConstants.SubService.annualRenew) {
              this.applicationType = true;
            }
          }
        }, (error: any) => {
          this.showLoadingIndicator = false;
        });
    }
  }

  approvedAction() {
    this.clearValidtions();
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: null, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.approved('Approved', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.getApplicationDetails();
        this.dispatchForm.get('comments').setValue('');
      });
  }

  requireMoreAction() {
    const dispatchVia = this.dispatchForm.get('dispatchVia');
    const dispatchDate = this.dispatchForm.get('dispatchDate');
    const comments = this.dispatchForm.get('comments');
    dispatchVia.setErrors(null);
    dispatchDate.setErrors(null);
    comments.setValidators([Validators.required]);
    this.submitted = true;
    if (this.dispatchForm.invalid) {
      return;
    }
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: null, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.requiredMore('RequireMoreInformation', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.utilService.navigateWithData(['dashboard'], null);
        this.dispatchForm.get('comments').setValue('');
      });
  }

  cardPrintedAction() {
    this.clearValidtions();
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: null, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.cardPrinted('CardPrinted', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.getApplicationDetails();
        this.dispatchForm.get('comments').setValue('');
      });
  }

  cardDispatchedAction() {
    const dispatchVia = this.dispatchForm.get('dispatchVia');
    const dispatchDate = this.dispatchForm.get('dispatchDate');
    const comments = this.dispatchForm.get('comments');
    dispatchVia.setValidators([Validators.required]);
    dispatchDate.setValidators([Validators.required]);
    comments.setErrors(null);
    this.submitted = true;
    if (this.dispatchForm.invalid) {
      return;
    }
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: this.dispatchForm.get('dispatchDate').value, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.cardDispatched('CardDispatched', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.utilService.navigateWithData(['dashboard'], null);
        this.dispatchForm.get('comments').setValue('');
      });
  }

  reClaimAction() {
    this.clearValidtions();
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: null, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.reClaim('ReClaim', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.getApplicationDetails();
        this.displayDialog = false;
        this.dispatchForm.get('comments').setValue('');
      });
  }

  claimAction() {
    this.clearValidtions();
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: null, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.claim('Claim', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.getApplicationDetails();
        this.displayDialog = false;
        this.dispatchForm.get('comments').setValue('');
      });
  }

  revokeClaimAction() {
    this.clearValidtions();
    this.iStatusUpdate = {
      id: this.applictionData.id, rowVersion: this.applictionData.rowVersion, comments: this.dispatchForm.get('comments').value,
      dispatchDate: null, trackingNumber: this.dispatchForm.get('trackingNumber').value,
      statusToId: this.applictionData.statusId
    };
    this.recreationalService.revokeClaim('RevokeClaim', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        this.utilService.navigateWithData(['dashboard'], null);
        this.dispatchForm.get('comments').setValue('');
      });
  }

  backToDashBoard() {
    this.utilService.navigateWithData(['dashboard'], null);
  }

  openDialog() {
    this.displayDialog = true;
  }

  printCardAction() {
    this.downloadLicenseCard(this.iDataTransferBetweenPages.id);
  }

  downloadLicenseCard(keyId: number) {
    if (keyId !== undefined) {
      this.showLoadingIndicator = true;
      this.recreationalService.getFileData('DownloadLicense', keyId)
        .subscribe((fileData: any) => {
          this.showLoadingIndicator = false;
          if (fileData !== undefined) {
            fileSaver.saveAs(fileData, 'RecreationalFishingLicense.pdf');
          }
        });
    }
  }
  customeFileDownload(rowdata) {
    this.showLoadingIndicator = true;
    if (rowdata !== undefined) {
      const downloadFile = rowdata.fileName;
      this.recreationalService.getCustomerFileData('ViewUploadedFile', rowdata.uploadedDocumentId)
        .subscribe((fileData: any) => {
          this.showLoadingIndicator = false;
          if (fileData !== undefined) {
            fileSaver.saveAs(fileData, downloadFile);
          }
        });
    }
  }
  clearValidtions() {
    const dispatchVia = this.dispatchForm.get('dispatchVia');
    const dispatchDate = this.dispatchForm.get('dispatchDate');
    const comments = this.dispatchForm.get('comments');
    dispatchVia.setErrors(null);
    dispatchDate.setErrors(null);
    comments.setErrors(null);
    this.submitted = false;
  }
}
export interface iStatusUpdate {
  id?: number;
  rowVersion?: string;
  comments?: string;
  dispatchDate?: string;
  trackingNumber?: string;
  statusToId?: number;
}
