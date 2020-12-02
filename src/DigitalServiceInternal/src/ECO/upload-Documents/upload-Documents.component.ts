import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UploadedDocumentsDetailsService } from './uploaded-documents-details.service';
import { FormGroup } from '@angular/forms';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { AppConstants } from './../../constants/constants';
import * as fileSaver from 'file-saver';
import { HelperService } from './../../common/helper.service';
import { InformationDialogComponent } from '../../shared/information-dialog/information-dialog.component';

@Component({
  selector: 'eco-uploaded-documents-details',
  templateUrl: './uploaded-documents-details.component.html',
  styleUrls: ['./uploaded-documents-details.component.scss']
})
export class UploadedDocumentsDetailsComponent implements OnInit {
  documentdetails: any;
  uploadDcoumentGroup: FormGroup;
  displayDateFormat = AppConstants.displayDateFormat;
  first = 0;
  @Input() eqsApplicationId;
  uploadedDocuments: any[];
  requiredDocuments: any[];
  showLoader: boolean;
  uploadedDocumentDetails: iUploadedDocuments[];
  iUploadedDocument: iUploadedDocuments;
  rowGroupMetadata: any;
  displayInformationPopUp: boolean;
  @ViewChild(InformationDialogComponent, null) informationComponnet: InformationDialogComponent;

  constructor(private uploadedDocumentsDetailsService: UploadedDocumentsDetailsService, private helperService: HelperService) { }

  ngOnInit() {
    this.helperService.doDbCalls(false);
    this.helperService.subscription = this.helperService.languageChanged
      .subscribe(languageChanged => {
        if (languageChanged) {
          this.getUploadedDocuments(this.eqsApplicationId);
        } else {
          this.displayInformationPopUp = false;
          this.getUploadedDocuments(this.eqsApplicationId);
        }
      });
    this.displayInformationPopUp = false;
    this.getUploadedDocuments(this.eqsApplicationId);
  }

  getUploadedDocuments(eQSApplicationId: number): void {
    this.showLoader = true;
    this.uploadedDocumentsDetailsService.getUploadedDocumentsDetails('RequiredDocumentsList', eQSApplicationId)
      .subscribe((uploadedDocumentsDetails) => {
        if (uploadedDocumentsDetails && uploadedDocumentsDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.uploadedDocuments = uploadedDocumentsDetails.uploadedDocuments;
          this.requiredDocuments = uploadedDocumentsDetails.requireddocuments;
          this.transformUploadDocumentsData();
          this.updateRowGroupMetaData();
          this.showLoader = false;
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  downloadUploadedFile(rowData: any): void {
    this.showLoader = true;
    this.uploadedDocumentsDetailsService.UploadedFileExist('UploadFileExist', rowData.uploadedDocumentId)
      .subscribe((fileexists) => {
        if (fileexists && fileexists.responseCode === AppConstants.APIResponseCodes.success) {
          this.uploadedDocumentsDetailsService.downloadUploadedFile('ViewUploadedFile', rowData.uploadedDocumentId)
            .subscribe((downloadFileDetails) => {
              if (downloadFileDetails) {
                fileSaver.saveAs(downloadFileDetails, rowData.customerFileName);
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
          this.showLoader = false;
        } else {
          this.informationComponnet.transformMessaages(fileexists.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoader = false;
        }
      }, (error: any) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  private updateRowGroupMetaData(): void {
    this.rowGroupMetadata = {};
    if (this.uploadedDocumentDetails) {
      for (let i = 0; i < this.uploadedDocumentDetails.length; i++) {
        const rowData = this.uploadedDocumentDetails[i];
        const documentName = rowData.documentName;
        if (i === 0) {
          this.rowGroupMetadata[documentName] = { index: 0, size: 1 };
        } else {
          const previousRowData = this.uploadedDocumentDetails[i - 1];
          const previousRowGroup = previousRowData.documentName;
          if (documentName === previousRowGroup) {
            this.rowGroupMetadata[documentName].size++;
          } else {
            this.rowGroupMetadata[documentName] = { index: i, size: 1 };
          }
        }
      }
    }
  }

  private transformUploadDocumentsData() {
    this.uploadedDocumentDetails = [];
    this.uploadedDocuments.forEach(element => {
      this.iUploadedDocument = {
        uploadedDocumentId: element.uploadedDocumentId,
        customerFileName: element.customerFileName,
        documentVersion: element.documentVersion,
        documentTypeId: element.documentTypeId,
        documentName: this.getDocumentName(element.documentTypeId)
      };
      this.uploadedDocumentDetails.push(this.iUploadedDocument);
    });
  }
  closeInformationPopUp(): void {
    this.displayInformationPopUp = false;
  }

  private getDocumentName(documentTypeId: number): string {
    let documentName: string;
    this.requiredDocuments.filter((requireddocument) =>
      requireddocument.documentTypeId === documentTypeId).forEach(element => {
        documentName = element.documentName;
      });
    return documentName;
  }
}
interface iUploadedDocuments {
  uploadedDocumentId: number;
  customerFileName: string;
  documentVersion: string;
  documentTypeId: number;
  documentName: string;
}
