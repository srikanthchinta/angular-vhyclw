import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';
import { AuthGuard } from 'digital-services-library';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { RecreationalComponent } from './customer-happiness/recreational/recreational.component';
import { LoginComponent } from './shared/login/login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recreational',
    component: RecreationalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'eqs',
    loadChildren: () => import('./eqs/eqs.module').then(m => m.EqsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'restrictedOffice',
    loadChildren: () => import('./restrictedoffices/restrictedoffice.module').then(m => m.RestrictedOfficeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'permit-inspection',
    loadChildren: () => import('./rasid/dispatcher/permit-inspection/permit-inspection.module')
      .then(m => m.PermitInspectionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'eco',
    loadChildren: () => import('./eco/eco.module').then(m => m.EcoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'translocation',
    loadChildren: () => import('./tree-translocation/tree-translocation.module')
      .then(m => m.TreeTranslocationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'complaints',
    loadChildren: () => import('./rasid/dispatcher/complaints/complaints.module')
      .then(m => m.ComplaintsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'yearly-routine-tasks',
    loadChildren: () => import('./rasid/dispatcher/yearly-routine-tasks/yearly-routine-tasks.module')
      .then(m => m.YearlyRoutineTasksModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'teamsroles',
    loadChildren: () => import('./rasid/dispatcher/teams-roles/teams-roles.module')
      .then(m => m.TeamsRolesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dispatcher-dashboard',
    loadChildren: () => import('./rasid/dispatcher/dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qadashboard',
    loadChildren: () => import('./rasid/qa/qa-dashboard/qa-dashboard.module')
      .then(m => m.QaDashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inspection-requests',
    loadChildren: () => import('./rasid/qa/inspection-requests/inspection-requests.module')
      .then(m => m.InspectionRequestsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'study-report-requests',
    loadChildren: () => import('./rasid/qa/study-report-requests/study-report-requests.module')
      .then(m => m.StudyReportRequestsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qa-configuration',
    loadChildren: () => import('./rasid/manager/qa-configuration/qa-configuration.module')
      .then(m => m.QaConfigurationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'process-setting',
    loadChildren: () => import('./rasid/manager/process-setting/process-setting.module')
      .then(m => m.ProcessSettingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'commercial-fishing',
    loadChildren: () => import('./commercial-fishing/commercial-fishing.module')
      .then(m => m.CommercialFishingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-happiness',
    loadChildren: () => import('./rasid/customer-happiness/customer-happiness.module')
      .then(m => m.CustomerHappinessModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'enforcement-setting',
    loadChildren: () => import('./rasid/manager/enforcement-setting/enforcement-setting.module')
      .then(m => m.EnforcementSettingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sla-setting',
    loadChildren: () => import('./rasid/manager/sla-setting/sla-setting.module')
      .then(m => m.SlaSettingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'investigation-requests',
    loadChildren: () => import('./rasid/qa/investigation-requests/investigation-requests.module')
      .then(m => m.InvestigationRequestsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'aquaculture',
    loadChildren: () => import('./aquaculture/aquaculture.module')
      .then(m => m.AquacultureModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'manager-dashboard',
    loadChildren: () => import('./rasid/manager/manager-dashboard/manager-dashboard.module')
      .then(m => m.ManagerDashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'legal-dashboard',
    loadChildren: () => import('./rasid/legal-role/legal-dashboard/legal-dashboard.module')
      .then(m => m.LegalDashboardModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'legal-case-requests',
  //   loadChildren: () => import('./rasid/legal-role/legal-case-requests/legal-case-requests.module')
  //     .then(m => m.LegalCaseRequestsModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'manual-legal-case',
    loadChildren: () => import('./rasid/legal-role/manual-legal-case/manual-legal-case.module')
      .then(m => m.ManualLegalCaseModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'groundwater',
    loadChildren: () => import('./groundwater/groundwater.module')
      .then(m => m.GroundwaterModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'study-request',
    loadChildren: () => import('./rasid/dispatcher/study-request/study-request.module')
      .then(m => m.StudyRequestModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inspector-dashboard', loadChildren: () => import('./rasid/Inspector/inspector-dashboard/inspector-dashboard.module')
      .then(m => m.InspectorDashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'study-and-report-requests',
    loadChildren: () => import('./rasid/Inspector/study-and-report-requests/study-and-report-requests.module')
      .then(m => m.StudyAndReportRequestsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'legal-case-requests',
    loadChildren: () => import('./rasid/Inspector/legal-case-requests/legal-case-requests.module')
      .then(m => m.LegalCaseRequestsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'unblocking-permits',
    loadChildren: () => import('./rasid/Inspector/unblocking-permits/unblocking-permits.module')
      .then(m => m.UnblockingPermitsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'legal-case',
    loadChildren: () => import('./rasid/legal-case/legal-case.module').then(m => m.LegalCaseModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'external-pages',
    component: NotFoundComponent,
    canActivate: [externalUrlProvider]
  },
];

@NgModule({
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.paramMap.get('externalUrl');
        window.open(externalUrl, '_blank');
      },
    },
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
