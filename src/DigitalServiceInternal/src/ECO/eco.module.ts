import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ECORoutingModule } from './eco-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcoComponent } from './eco/eco.component';
import { TabViewModule } from 'primeng/tabview';
import { AdminstrativeDetailsComponent } from './adminstrative-details/adminstrative-details.component';
import { UploadedDocumentsDetailsComponent } from './uploaded-documents-details/uploaded-documents-details.component';
import { PermitSectionComponent } from './permit-section/permit-section.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ViewProjectDetailsComponent } from './view-project-details/view-project-details.component';
import { ViewTechnicalTeamDetailsComponent } from './view-technical-team-details/view-technical-team-details.component';
import { ViewFieldsOfWorkComponent } from './view-fields-of-work/view-fields-of-work.component';
import { AddViewRemarksComponent } from './add-view-remarks/add-view-remarks.component';
import { ViewTaskHistoryComponent } from './view-task-history/view-task-history.component';
import { SharedModule } from './../shared/shared.module';
import { KeyFilterModule } from 'primeng/keyfilter';


@NgModule({
  declarations: [
    EcoComponent,
    AdminstrativeDetailsComponent,
    UploadedDocumentsDetailsComponent,
    PermitSectionComponent,
    ViewProjectDetailsComponent,
    ViewTechnicalTeamDetailsComponent,
    ViewFieldsOfWorkComponent,
    AddViewRemarksComponent,
    ViewTaskHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ECORoutingModule,
    TabViewModule,
    TableModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    SharedModule,
    KeyFilterModule,
    TranslateModule.forChild()
  ]
})
export class EcoModule { }
