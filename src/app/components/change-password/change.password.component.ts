import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CredServices } from "src/app/shared/services/cred.service";
import { ChangePasswordService } from "./change.password.service";

@Component({
    selector: 'app-change-password',
    templateUrl: './change.password.component.html',
    styleUrls: ['./change.password.component.scss']
})


export class ChangePasswordComponent {
    constructor(
        private dialogRef: MatDialogRef<ChangePasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private credServices: CredServices,
        private changePasswordServices: ChangePasswordService,
        private snackbar: MatSnackBar
    ) {}

    currentPassword: string = "";
    newPassword: string = ""
    isCurrentPasswordCorrect: boolean = false;
    @ViewChild("txtNewPassword")txtNewPassword: ElementRef

    validateChangePasswordAdmin() {
        if(this.isCurrentPasswordCorrect == false || this.newPassword.trim() == "") {
            return true
        }
        return false
    }

    validatePassword() {
        if(this.currentPassword.trim() != "") {
            const payload = {
                user_id: this.credServices.getCredentials().user.id,
                password: this.currentPassword
            }
            this.changePasswordServices.validateAdminPassword(payload).subscribe((res: any) => {
                this.isCurrentPasswordCorrect = res.isPasswordCorrect
                if(res.isPasswordCorrect) {
                    setTimeout(() => {
                        this.txtNewPassword.nativeElement.focus()
                    }, 0);
                }
                this.snackbar.open(res.message, "", { duration: 3000 })
              
            })
        }
    }

    isUpdatingPassword: boolean = false;
    updateNewPassword() {
        if(this.newPassword.trim() != "") {
            this.isUpdatingPassword = true;
            const payload = { 
                user_id: this.credServices.getCredentials().user.id,
                new_password: this.newPassword
            }
            this.changePasswordServices.updateNewPassword(payload).subscribe((res: any) => {
                this.isUpdatingPassword = false;
                this.snackbar.open(res.message, "", { duration: 3000})
                this.dialogRef.close()
            })
        }
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    currentPasswordClient: string = "";
    newPasswordClient: string = "";
    isCurrentPasswordCorrentClient: boolean = false;
    @ViewChild("txtNewPasswordClient")txtNewPasswordClient: ElementRef

    validatePasswordClient() {
        const payload = {
            id: this.credServices.getCredentials().client_user._id,
            password: this.currentPasswordClient
        }
        console.log(payload)
        this.changePasswordServices.validateClientPassword(payload).subscribe((res: any) => {
            console.log(res)
            this.isCurrentPasswordCorrentClient = res.isPasswordCorrect,
            this.snackbar.open(res.message, "", { duration: 3000 })
            setTimeout(() => {
                this.txtNewPasswordClient.nativeElement.focus()
            }, 0);
        })
    }

    validateChangePasswordClient () {
        if(this.isCurrentPasswordCorrentClient == false || this.newPasswordClient.trim() == "") {
            return true
        }
        return false
    }

    isUpdatingPasswordClient: boolean = false;


    updateNewPasswordClient() {
        this.isUpdatingPasswordClient = true;
        const payload = {
            id: this.credServices.getCredentials().client_user._id,
            password: this.newPasswordClient
        }
        this.changePasswordServices.updatePasswordClient(payload).subscribe((res: any) => {
            this.isUpdatingPasswordClient = false;
            this.snackbar.open(res.message, "", { duration: 3000 })
            this.dialogRef.close()
        })
    }

}