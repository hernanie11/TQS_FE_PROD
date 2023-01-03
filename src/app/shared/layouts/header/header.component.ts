import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/components/change-password/change.password.component';
import { CredServices } from '../../services/cred.service';
import { LocalService } from '../../services/local.service';
import { HeaderServices } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private localService: LocalService,
    private router: Router,
    public headerServices: HeaderServices,
    private credServices: CredServices,
    private dialog: MatDialog
  ) { }

  @Output() toogleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() deviceXs: boolean
  loggingOut: boolean = false;

  ToogleSideBar() {
    this.toogleSidebar.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      disableClose: true,
      data: {
        title: "Change Password",
        action: "change-password-admin"
      }
    })
  }

  logout() {
    this.loggingOut = true;
    this.headerServices.logOut().subscribe(() => {
      this.localService.clearToken()
      this.router.navigate(["/administrator/authentication"]).then(() => location.reload())
    })
  }

  getNameOfUser() {
    const { user: {first_name, last_name} } = this.credServices.getCredentials();
    return `${first_name} ${last_name}`;
  }
  
}
