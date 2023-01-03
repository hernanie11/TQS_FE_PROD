import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HelperServices } from 'src/app/shared/services/helpers.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { AdminLoginServices } from './admin-login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {

  constructor(
    private fb: FormBuilder,
    private adminLoginServices: AdminLoginServices,
    private snackBar: MatSnackBar,
    private router: Router,
    private localService: LocalService,
    private helperServices: HelperServices
  ) { }

  /** @States ============================================================ */
  loginForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  })
  isAuthenticating: boolean = false;
  btnLogin: "Login" | "Authenticating" = "Login";
  hide = true;
  troubleshoot: boolean = false;

  /** @Methods ============================================================ */
  authenticate() {
    this.isAuthenticating = true;
    this.btnLogin = "Authenticating";
    this.adminLoginServices.authenticate(this.loginForm.value).subscribe(res => {
      /*****************@SET_STATE_VALUES ******************** */
      const { status, body: { data: { token, user }, message } } = res;
      if(status == 200) {
         if (user) {
          user.access_permission = user.access_permission.split(", ")
        }
        this.localService.setJsonValue("token", token);
        this.localService.setJsonValue("user", user);
        this.isAuthenticating = false;
        this.btnLogin = "Login";
        this.snackBar.open(message, "", { duration: 3000 })
        this.router.navigate(["/admin/user-accounts"]).then(() => location.reload())
      }
    }, err => {
      // this.troubleshoot = true;
      // this.snackBar.open("Requested Timeout..", "", { duration: 3000 })
      console.log(err)
      this.isAuthenticating = false;
      this.btnLogin = "Login";
      this.helperServices.catchError(err, true, 3000, err.error.message)
    })
  }

}