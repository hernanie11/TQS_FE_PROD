import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AppServices } from "src/app/app.service";
import { LocalService } from "src/app/shared/services/local.service";
import { ClientLoginServices } from "./client.login.service";

@Component({
    selector: 'app-client-login',
    templateUrl: './client.login.component.html',
    styleUrls: ['./client.login.component.scss']
})

export class ClientLoginComponent implements OnInit {
    constructor(
        private clientLoginServices: ClientLoginServices,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private localService: LocalService,
        private router: Router,
        private appService: AppServices
    ) { }

    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    })
    hide = true;
    version = null;

    login() {
        this.clientLoginServices.login(this.loginForm.value).subscribe(res => {
            const { token, user, storeActivated } = res;
            user.access_permission = user.access_permission.toString().split(", ")
            this.localService.setJsonValue("client-user", user)
            this.localService.setJsonValue("client-token", token)
            this.localService.setJsonValue("store-activated", storeActivated)
            this.router.navigate(['/client/transactions']).then(() => location.reload())
        }, err => {
            const { error: { message } } = err;
            this.snackBar.open(message, "", {
                duration: 3000
            })
        })
    }
//     version() {
//         this.clientLoginServices.version().subscribe(res => {
// return res
//         }, err => {
// console.log(err)
//         });
//     }


    
    ngOnInit(): void {
        if (!this.appService.isServerStarted) {
            this.router.navigate(['/portal/getting-started'])
            
        }

        this.clientLoginServices.version().subscribe(res => {
            this.version = res;
        }, err => {
            console.log(err)
        })
    }

}