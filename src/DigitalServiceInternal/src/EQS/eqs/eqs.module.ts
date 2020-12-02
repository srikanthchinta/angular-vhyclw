import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from './../shared/shared.module';
import { PermitSectionComponent } from './permit-section/permit-section.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EQSRoutingModule } from './eqs-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqsComponent } from './eqs/eqs.component';
import { TabViewModule } from 'primeng/tabview';
import { AdminstrativeDetailsComponent } from './adminstrative-details/adminstrative-details.component';
import { TechnicalDetailsComponent } from './technical-details/technical-details.component';
import { SectorSpecificQuestionsDetailsComponent } from './sector-specific-questions-details/sector-specific-questions-details.component';
import { CriticalQuestionsDetailsComponent } from './critical-questions-details/critical-questions-details.component';
import { NonCriticalQuestionsDetailsComponent } from './non-critical-questions-details/non-critical-questions-details.component';
import { UploadedDocumentsDetailsComponent } from './uploaded-documents-details/uploaded-documents-details.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ReportsComponent } from './reports/reports.component';
import { AddViewReportsComponent } from './add-view-reports/add-view-reports.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { AddViewRequestForAssistanceComponent } from './add-view-request-for-assistance/add-view-request-for-assistance.component';
import { AddViewPermitConditionsComponent } from './add-view-permit-conditions/add-view-permit-conditions.component';
import { AddViewFacilityProjectClassComponent } from './add-view-facility-project-class/add-view-facility-project-class.component';
import { StudiesComponent } from './studies/studies.component';
import { ViewTaskHistoryComponent } from './view-task-history/view-task-history.component';
import { InspectionHistoryComponent } from './inspection-history/inspection-history.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePipe } from '@angular/common';
import { ViewUploadedStudiesReportsDetailsComponent } from './view-uploaded-studies-reports-details/view-uploaded-studies-reports-details.component';
import { RequestAndReviewFormComponent } from './request-and-review-form/request-and-review-form.component';

@NgModule({
  providers: [
    DatePipe
  ],
  declarations: [
    EqsComponent,
    AdminstrativeDetailsComponent,
    TechnicalDetailsComponent,
    SectorSpecificQuestionsDetailsComponent,
    CriticalQuestionsDetailsComponent,
    NonCriticalQuestionsDetailsComponent,
    UploadedDocumentsDetailsComponent,
    PermitSectionComponent,
    AddViewRequestForAssistanceComponent,
    ReportsComponent,
    AddViewReportsComponent,
    AddViewPermitConditionsComponent,
    AddViewFacilityProjectClassComponent,
    StudiesComponent,
    ViewTaskHistoryComponent,
    InspectionHistoryComponent,
    ViewUploadedStudiesReportsDetailsComponent,
    RequestAndReviewFormComponent
  ],
  imports: [
    KeyFilterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EQSRoutingModule,
    TabViewModule,
    TableModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    SharedModule,
    FileUploadModule,
    TranslateModule.forChild(),
  ]
})
export class EqsModule { }
