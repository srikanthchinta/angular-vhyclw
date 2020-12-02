import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../../common/helper.service';
import { UtilService } from 'digital-services-library';
import { AppConstants, iDropdown } from '../../../constants/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderService } from './header.service';
@Component({
  selector: 'EAD-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  backdropCondition = false;
  @Input() isAppLanguageEnglish: boolean;
  @Output() setAppLanguage = new EventEmitter<string>();

  userProfilePic: any;
  isLoggedInUserPictureLoaded: boolean;
  isUserLogin: boolean;
  userName: string;
  role: string;
  roles: iDropdown[];
  userPanel: boolean;
  selectedRole: any;
  menuItems: any[];
  constructor(
    private router: Router, private helperService: HelperService,
    private utilService: UtilService,
    private domSanitizer: DomSanitizer, private headerService: HeaderService) { }

  ngOnInit() {
    this.loadMenu();
    this.helperService.loggedInUserProfilePic
      .subscribe(loggedInUserDetails => {
        if (loggedInUserDetails !== undefined && loggedInUserDetails !== null) {
          let iDropdownObj: iDropdown;
          this.isLoggedInUserPictureLoaded = true;
          this.isUserLogin = true;
          this.userName = loggedInUserDetails.name;
          this.roles = [];
          this.userProfilePic = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + loggedInUserDetails.profilePic);
          for (const role of loggedInUserDetails.roles) {
            iDropdownObj = { label: role.roleName, value: role.roleId };
            this.roles.push(iDropdownObj);
          }
          const logout = this.utilService.getDisplayText('Common.logout');
          iDropdownObj = { label: logout, value: -1 };
          this.roles.push(iDropdownObj);
          this.role = loggedInUserDetails.defaultRoleName;
        } else {
          this.userProfilePic = '/assets/images/default-login-user.svg';
          this.isLoggedInUserPictureLoaded = true;
        }
      });
    this.helperService.loginPageRevisited.subscribe((loginPageRevisited: boolean) => {
      this.isUserLogin = loginPageRevisited;
      this.utilService.clearSessionStorage();
    });
  }

  settingAppLanguage(): void {
    this.setAppLanguage.next();
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '440px';
    document.getElementById('closebtn').style.display = 'block';
    this.backdropCondition = true;
  }

  closeNav(event?: { target: { classList: { contains: (arg0: string) => any; }; }; }) {
    if (this.backdropCondition && !event.target.classList.contains('bar') && !event.target.classList.contains('hamburger-icon')) {
      document.getElementById('mySidenav').style.width = '0';
      document.getElementById('closebtn').style.display = 'none';
      this.backdropCondition = false;
    }
  }

  menuItemClicked(selectedUrl: string): void {
    if (selectedUrl === '/external-pages') {
      this.router.navigate(['/external-pages', { externalUrl: 'https://eservices.ead.ae/en/web/guest/info-center' }]);
    }
  }

  navigateTo(event: any) {
    this.closeNav(event);
    this.router.navigate(['dashboard']);
  }

  showPanel() {
    this.userPanel = !this.userPanel;
  }

  roleChange(event: { value: { value: number; }; }) {
    if (event.value === null) {
      return;
    }
    if (event.value.value === -1) {
      this.isUserLogin = false;
      this.utilService.clearSessionStorage();
      window.location.reload();
    } else {
      this.headerService.tokenForUserRoleChange('ChangeUserRole', event.value.value)
        .subscribe((response: any) => {
          if (response && response.responseCode === AppConstants.APIResponseCodes.success) {
            this.utilService.setValueToSessionStorage('AuthToken', JSON.stringify(response.userToken));
          } else {
            console.error(response);
          }
        });
    }
    this.closeUserDropDown();
  }

  closeUserDropDown() {
    this.userPanel = false;
  }

  private loadMenu(): void {
    this.menuItems = [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Legal Cases',
        url: '/legal-case',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Study Request',
        url: '/study-request',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Investigation',
        url: '/complaints',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Inspection',
        url: '/permit-inspection',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Teams & Roles',
        url: '/teamsroles',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Yearly',
        url: '/yearly-routine-tasks',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Customer Happiness',
        url: '/customer-happiness',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Inspection Requests',
        url: '/inspection-requests',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Study & Report Requests',
        url: '/study-report-requests',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Investigation Requests',
        url: '/investigation-requests',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Process Setting',
        url: '/process-setting',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'SLA Setting',
        url: '/sla-setting',
        icon: 'assets/images/dashboard.svg'
      }, {
        title: 'Enforcement Setting',
        url: '/enforcement-setting',
        icon: 'assets/images/dashboard.svg'
      },
      {
        title: 'Information Center',
        url: '/external-pages',
        icon: 'assets/images/globe.svg'
      }
    ];
  }
}
