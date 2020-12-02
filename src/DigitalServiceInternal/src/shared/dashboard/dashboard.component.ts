import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppConstants } from '../../constants/constants';
import { iDataTransferBetweenPages } from '../../common/data-transfer-between-pages';
import { SelectItem } from 'primeng/api';
import { UtilService } from 'digital-services-library';
import { HelperService } from '../../common/helper.service';
import { LazyLoadEvent } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { iDashboard, iStatusUpdate } from './dashboard';
import { InformationDialogComponent } from '../../shared/information-dialog/information-dialog.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  iDashboard: iDashboard;
  iStatusUpdate: iStatusUpdate;
  dashbordData: any;
  serviceData: SelectItem[];
  pageSize: number = AppConstants.gridPageSize;
  first = 0;
  displayDateFormat = AppConstants.displayDateFormat;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  displayDialog = false;
  totalRecords = 0;
  url: any;
  checked = false;
  searchForm: FormGroup;
  isFormSubmitted: boolean;
  showLoadingIndicator: boolean;
  noDataFound: boolean;
  showDataTable: boolean;
  displayInformationPopUp: boolean;
  @ViewChild(InformationDialogComponent, null) informationComponet: InformationDialogComponent;

  constructor(
    private dashboardService: DashboardService,
    private utilService: UtilService, private helperService: HelperService
  ) { }

  ngOnInit() {
    this.onPageLoad();
  }

  private onPageLoad() {
    this.iDashboard = {
      searchText: null, pageNumber: 1, orderBy: null, orderDirection: null, pageSize: this.pageSize, serviceId: null,
      includeCompletedTasks: this.checked
    };
    this.showLoadingIndicator = false;
    this.isFormSubmitted = false;
    this.checked = false;
    this.noDataFound = false;
    this.showDataTable = true;
    this.getServiceDropdown();
    this.helperService.doDbCalls(false);
    this.createSearchDetailsForm();
    this.helperService.subscription = this.helperService.languageChanged
      .subscribe(languageChanged => {
        if (languageChanged) {
          this.getCommonDashBoardDetails();
        } else {
          this.isFormSubmitted = false;
          this.checked = false;
          this.noDataFound = false;
          this.showDataTable = true;
          this.getCommonDashBoardDetails();
          this.getServiceDropdown();
        }
      });
  }

  get searchValue() {
    return this.searchForm.get('searchValue');
  }

  get selectedSerice() {
    return this.searchForm.get('selectedSerice');
  }

  onSearchTextBoxKeydown(event: { key: string; }): void {
    if (event.key === 'Enter') {
      this.searchCustomerDetails();
    }
  }

  serviceChange(): void {
    const serviceVal = this.searchForm.get('selectedSerice').value == null ? '' : this.searchForm.get('selectedSerice').value;
    this.iDashboard = {
      searchText: this.searchValue.value, pageNumber: 1, orderBy: null, orderDirection: 'Desc', pageSize: this.pageSize,
      serviceId: Number(serviceVal.value), includeCompletedTasks: Boolean(true)
    };
    this.getCommonDashBoardDetails();
  }

  private getServiceDropdown(): void {
    this.dashboardService.getserviceDetails('GetUserRoleServices')
      .subscribe((serviceDetails: any) => {
        this.serviceData = this.helperService.prepareDropDownData(serviceDetails);
      });
  }

  searchCustomerDetails(): void {
    const serviceVal = this.searchForm.get('selectedSerice').value == null ? '' : this.searchForm.get('selectedSerice').value;
    this.iDashboard = {
      searchText: this.searchValue.value, pageNumber: 1, orderBy: null, orderDirection: 'Desc',
      pageSize: this.pageSize, serviceId: Number(serviceVal.value), includeCompletedTasks: Boolean(true)
    };
    this.getCommonDashBoardDetails();
  }

  loadDashboardLazy(event: LazyLoadEvent): void {
    const serviceVal = this.searchForm.get('selectedSerice').value == null ? '' : this.searchForm.get('selectedSerice').value;
    const pageIndex = event.first / event.rows + 1;
    const sortOrder = event.sortOrder === 1 ? 'Desc' : 'Asc';
    const sortField = event.sortField === undefined ? null : event.sortField;
    this.iDashboard = {
      searchText: this.searchValue.value, pageNumber: pageIndex, orderBy: sortField, orderDirection: sortOrder,
      pageSize: this.pageSize, serviceId: Number(serviceVal.value), includeCompletedTasks: this.checked
    };
    this.getCommonDashBoardDetails();
  }

  private getCommonDashBoardDetails(): void {
    this.showLoadingIndicator = true;
    this.dashboardService.getCommonDashboardDetails('CommonApplicationDashBoardSelect', this.iDashboard)
      .subscribe((permitDetails: any) => {
        if (permitDetails && permitDetails.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.noDataFound = false;
          this.showDataTable = true;
          this.dashbordData = permitDetails.result;
          this.totalRecords = (permitDetails.result.length > 0) ? this.dashbordData[0].totalRecords : 0;
        } else {
          this.showLoadingIndicator = false;
          this.totalRecords = 0;
          this.noDataFound = true;
          this.showDataTable = false;
          this.dashbordData = null;
        }
      }, (error: any) => {
        this.showLoadingIndicator = false;
        console.error(error);
      });
  }

  applicationNoClick(rowData: any): void {
    if (!rowData) {
      return;
    }
    this.dashboardService.tokenForUserRoleChange('ChangeUserRole', rowData.roleId)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.userToken));
          if (rowData.serviceId === AppConstants.Service.recreationalFishing) {
            this.openRecreationalPage(rowData);
          } else if (rowData.serviceId === AppConstants.Service.developmentAndInfrastructureProjects ||
            rowData.serviceId === AppConstants.Service.commercialEnvironmentalLicense ||
            rowData.serviceId === AppConstants.Service.industrialFacilities) {
            this.openEQSPage(rowData);
          } else if (rowData.serviceId === AppConstants.Service.environmentalConsultancyOffice) {
            this.openECOPage(rowData.subServiceApplicationId);
          } else if (rowData.serviceId === AppConstants.Service.aquaculture) {
            this.openAquaculturePage(rowData.subServiceApplicationId);
          } else if (rowData.serviceId === AppConstants.Service.nativeTreesPlantationAndTranslocation) {
            this.openTreeTransLocationPage(rowData.subServiceApplicationId);
          } else if (rowData.serviceId === AppConstants.Service.commercialFishing) {
            this.openCommercialFishingPage(rowData.subServiceApplicationId);
          }
        } else {
          console.error(response);
        }
      }, (error: any) => {
        console.error(error);
      });
  }

  claimAction(rowData: any): void {
    if (!rowData) {
      return;
    }
    this.dashboardService.tokenForUserRoleChange('ChangeUserRole', rowData.roleId)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.userToken));
          if (rowData.serviceId === AppConstants.Service.recreationalFishing) {
            this.claimRecreationalApplication(rowData);
          } else if (rowData.serviceId === AppConstants.Service.developmentAndInfrastructureProjects ||
            rowData.serviceId === AppConstants.Service.commercialEnvironmentalLicense ||
            rowData.serviceId === AppConstants.Service.industrialFacilities) {
            this.claimEQSApplication(rowData);
          } else if (rowData.serviceId === AppConstants.Service.environmentalConsultancyOffice) {
            this.claimECOApplication(rowData);
          } else if (rowData.serviceId === AppConstants.Service.commercialFishing) {
            this.claimReclaimRevokeCFLApplication(rowData, true);
          }
        } else {
          console.error(response);
        }
      }, (error: any) => {
        console.error(error);
      });
  }

  reClaimAction(): void {
    this.dashboardService.tokenForUserRoleChange('ChangeUserRole', this.iStatusUpdate.roleId)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.userToken));
          if (this.iDataTransferBetweenPages.serviceId === AppConstants.Service.recreationalFishing) {
            this.reClaimRecreationalApplication();
          } else if (this.iDataTransferBetweenPages.serviceId === AppConstants.Service.commercialEnvironmentalLicense ||
            this.iDataTransferBetweenPages.serviceId === AppConstants.Service.developmentAndInfrastructureProjects ||
            this.iDataTransferBetweenPages.serviceId === AppConstants.Service.industrialFacilities) {
            this.reClaimEQSApplication();
          } else if (this.iDataTransferBetweenPages.serviceId === AppConstants.Service.environmentalConsultancyOffice) {
            this.reClaimECOApplication();
          } else if (this.iDataTransferBetweenPages.serviceId === AppConstants.Service.commercialFishing) {
            this.claimReclaimRevokeCFLApplication(this.iDataTransferBetweenPages, true);
          }
        } else {
          console.error(response);
        }
      }, (error: any) => {
        console.error(error);
      });
  }

  revokeClaimAction(rowData: any): void {
    if (!rowData) {
      return;
    }
    this.dashboardService.tokenForUserRoleChange('ChangeUserRole', rowData.roleId)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.displayInformationPopUp = false;
          this.showLoadingIndicator = false;
          this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.userToken));
          if (rowData.serviceId === AppConstants.Service.recreationalFishing) {
            this.revokeRecreationalApplication(rowData);
          } else if (rowData.serviceId === AppConstants.Service.developmentAndInfrastructureProjects ||
            rowData.serviceId === AppConstants.Service.commercialEnvironmentalLicense ||
            rowData.serviceId === AppConstants.Service.industrialFacilities) {
            this.revokeEQSApplication(rowData);
          } else if (rowData.serviceId === AppConstants.Service.environmentalConsultancyOffice) {
            this.revokeECOApplication(rowData);
          } else if (rowData.serviceId === AppConstants.Service.commercialFishing) {
            this.claimReclaimRevokeCFLApplication(rowData, false, 'revoke');
          }
        } else if ((response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(response.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
      });
  }

  private openRecreationalPage(rowData: { subServiceApplicationId: any; rowVersion: any; }): void {
    this.iDataTransferBetweenPages = { id: rowData.subServiceApplicationId, rowVersion: rowData.rowVersion };
    this.utilService.navigateWithData(['/recreational'], this.iDataTransferBetweenPages);
  }

  private claimRecreationalApplication(rowdata: any): void {
    this.iStatusUpdate = { id: rowdata.subServiceApplicationId, rowVersion: rowdata.rowVersion };
    this.dashboardService.claimRecreationalApplication('Claim', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        if (permitDetails) {
          this.iDataTransferBetweenPages = { id: rowdata.subServiceApplicationId, rowVersion: rowdata.rowVersion };
          this.utilService.navigateWithData(['/recreational'], this.iDataTransferBetweenPages);
        }
      });
  }

  private reClaimRecreationalApplication(): void {
    this.dashboardService.reClaimRecreationalApplication('ReClaim', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        if (permitDetails) {
          this.utilService.navigateWithData(['/recreational'], this.iDataTransferBetweenPages);
        }
      });
  }

  private revokeRecreationalApplication(rowdata: { subServiceApplicationId: any; rowVersion: any; }): void {
    this.iStatusUpdate = { id: rowdata.subServiceApplicationId, rowVersion: rowdata.rowVersion };
    this.dashboardService.revokeClaimedRecreationalApplication('RevokeClaim', this.iStatusUpdate)
      .subscribe((permitDetails: any) => {
        if (permitDetails) {
          this.getCommonDashBoardDetails();
        }
      });
  }

  private openEQSPage(rowData: any): void {
    this.iDataTransferBetweenPages = {
      id: rowData.subServiceApplicationId,
      dataClassificationTypeId: rowData.dataClassificationTypeId,
      actionTypeId: (rowData.claim) ? 1 : (rowData.reClaim) ? 2 : (rowData.revokeClaim) ? 3 : 0
    };
    if (rowData.dataClassificationTypeId !== AppConstants.dataClassificationTypes.techReviewerAssistanceRequest
      && rowData.dataClassificationTypeId !== AppConstants.dataClassificationTypes.smeAssistanceRequest) {
      this.iDataTransferBetweenPages.requestId = rowData.requestId;
    }
    this.utilService.navigateWithData(['/eqs'], this.iDataTransferBetweenPages);
  }

  private claimEQSApplication(rowData: any): void {
    this.showLoadingIndicator = true;
    this.dashboardService.claimEQSApplication('Claim', rowData)
      .subscribe((claimed: any) => {
        if (claimed && claimed.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.iDataTransferBetweenPages = {
            id: rowData.subServiceApplicationId, requestId: rowData.requestId,
            dataClassificationTypeId: rowData.dataClassificationTypeId
          };
          this.utilService.navigateWithData(['/eqs'], this.iDataTransferBetweenPages);
        } else if ((claimed.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          claimed.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(claimed.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(claimed.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }

  private reClaimEQSApplication(): void {
    this.showLoadingIndicator = true;
    this.dashboardService.reClaimEQSApplicaiton('ReClaim', this.iDataTransferBetweenPages)
      .subscribe((reClaimed: any) => {
        if (reClaimed && reClaimed.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.iDataTransferBetweenPages = { id: this.iDataTransferBetweenPages.id };
          this.utilService.navigateWithData(['/eqs'], this.iDataTransferBetweenPages);
        } else if ((reClaimed.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          reClaimed.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(reClaimed.errorMessages);
          this.displayDialog = false;
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(reClaimed.errorMessages, AppConstants.InformationType.error);
          this.displayDialog = false;
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }

  private revokeEQSApplication(rowData: any): void {
    this.showLoadingIndicator = true;
    this.dashboardService.revokeClaimedEQSApplication('RevokeClaim', rowData)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.getCommonDashBoardDetails();
        } else if ((response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(response.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }

  private openECOPage(eqsApplicationId: number): void {
    this.iDataTransferBetweenPages = { id: eqsApplicationId };
    this.utilService.navigateWithData(['/eco'], this.iDataTransferBetweenPages);
  }

  private claimECOApplication(rowData: any): void {
    this.showLoadingIndicator = true;
    this.dashboardService.claimECOApplication('Claim', rowData)
      .subscribe((claimed: any) => {
        if (claimed && claimed.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.iDataTransferBetweenPages = { id: rowData.subServiceApplicationId };
          this.utilService.navigateWithData(['/eco'], this.iDataTransferBetweenPages);
        } else if ((claimed.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          claimed.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(claimed.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(claimed.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }

  private reClaimECOApplication(): void {
    this.showLoadingIndicator = true;
    this.dashboardService.reClaimECOApplicaiton('ReClaim', this.iDataTransferBetweenPages)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.utilService.navigateWithData(['/eco'], this.iDataTransferBetweenPages);
        } else if ((response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(response.errorMessages);
          this.displayDialog = false;
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
          this.displayDialog = false;
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }

  private revokeECOApplication(rowData: any): void {
    this.showLoadingIndicator = true;
    this.dashboardService.revokeClaimedECOApplication('RevokeClaim', rowData)
      .subscribe((response: any) => {
        if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.getCommonDashBoardDetails();
        } else if ((response.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          response.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(response.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(response.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }

  private claimReclaimRevokeCFLApplication(rowData: any, condition: boolean, req?): void {
    this.showLoadingIndicator = true;
    this.dashboardService.claimReclaimRevokeCommercialFishingApp('Claim', rowData, condition)
      .subscribe((claimed: any) => {
        if (claimed && claimed.responseCode === AppConstants.APIResponseCodes.success) {
          this.showLoadingIndicator = false;
          this.iDataTransferBetweenPages = { id: rowData.subServiceApplicationId };
          if (req !== 'revoke') {
            this.utilService.navigateWithData(['/commercial-fishing'], this.iDataTransferBetweenPages);
          } else {
            this.getCommonDashBoardDetails();
          }
        } else if ((claimed.responseCode === AppConstants.APIResponseCodes.businessValidationFailed ||
          claimed.responseCode === AppConstants.APIResponseCodes.dataValidationFailed) && (this.informationComponet)) {
          this.informationComponet.transformMessaages(claimed.errorMessages);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        } else {
          this.informationComponet.transformMessaages(claimed.errorMessages, AppConstants.InformationType.error);
          this.displayInformationPopUp = true;
          this.showLoadingIndicator = false;
        }
      }, (error: any) => {
        console.error(error);
        this.showLoadingIndicator = false;
      });
  }
  openDialog(rowData: {
    subServiceApplicationId: any; rowVersion: any; serviceId: any; roleId: number,
    requestId: number, dataClassificationTypeId: number, claimedByUserId: number
  }): void {
    this.iStatusUpdate = { id: rowData.subServiceApplicationId, rowVersion: rowData.rowVersion, roleId: rowData.roleId };
    this.iDataTransferBetweenPages = {
      id: rowData.subServiceApplicationId, rowVersion: rowData.rowVersion, serviceId: rowData.serviceId,
      requestId: rowData.requestId, dataClassificationTypeId: rowData.dataClassificationTypeId,
      claimedByUserId: rowData.claimedByUserId
    };
    this.displayDialog = true;
  }

  clearData(): void {
    this.noDataFound = false;
    this.showDataTable = true;
    this.checked = false;
    this.isFormSubmitted = false;
    this.searchForm.reset();
    this.iDashboard = {
      searchText: null, pageNumber: 1, orderBy: null, orderDirection: null, pageSize: this.pageSize, serviceId: null,
      includeCompletedTasks: this.checked
    };
    this.getCommonDashBoardDetails();
  }
  closeInformationPopUp(): void {
    this.displayInformationPopUp = false;
  }
  private createSearchDetailsForm(): void {
    this.searchForm = new FormGroup({
      selectedSerice: new FormControl('', null),
      searchValue: new FormControl('', null),
    });
  }
  private openAquaculturePage(aquacultureApplicationId: number): void {
    this.iDataTransferBetweenPages = { id: aquacultureApplicationId };
    this.utilService.navigateWithData(['/aquaculture'], this.iDataTransferBetweenPages);
  }
  private openTreeTransLocationPage(treeTransLocationId: number): void {
    this.iDataTransferBetweenPages = { id: treeTransLocationId };
    this.utilService.navigateWithData(['/translocation'], this.iDataTransferBetweenPages);
  }
  private openCommercialFishingPage(commercialFishingAppId: number): void {
    this.iDataTransferBetweenPages = { id: commercialFishingAppId };
    this.utilService.navigateWithData(['/commercial-fishing'], this.iDataTransferBetweenPages);
  }
}
