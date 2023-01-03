import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { LocalService } from "src/app/shared/services/local.service";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-dialog',
    templateUrl: './user-accounts.dialog.component.html',
    styleUrls: ['./user-accounts.dialog.component.scss']
})

export class UserAccountsDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<UserAccountsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userAccountServices: UserAccountsServices,
        private router: Router,
        private snackBar: MatSnackBar,
        private localServices: LocalService,
        private credServices: CredServices,
        private helperServices: HelperServices
    ) { }

    /** @States ==================================================== */
    isButtonLoading: boolean = false;

    /** @Methods ==================================================== */
    create() {
        this.isButtonLoading = true;
        this.data.button_name = "Creating..";
        this.userAccountServices.createUserAccount(this.data.userAccountForm).subscribe(res => {
            const { status, body: { message } } = res;
            if(status == 201) {
                 this.snackBar.open(message, "", { duration: 3000 })
                 this.isButtonLoading = false;
                 this.data.button_name = "Create";
                this.router.navigate(["/admin/user-accounts"])
                this.dialogRef.close()
            }
            
        }, err => {
            this.helperServices.catchError(err, true, 3000, err.error.message)
            this.isButtonLoading = false;
            this.data.button_name = "Create";
        })
    }

    update() {
        this.isButtonLoading = true;
        this.data.button_name = "Updating";
        const { userId, updatedUserAccounts } = this.data;
        this.userAccountServices.updateUserAccountById(userId, updatedUserAccounts).subscribe(res => {
            const { status, body: { message } } = res;
            if(status == 200) {
                this.snackBar.open(message, "", { duration: 3000 })
                if (this.credServices.getCredentials().user.id == userId) {
                    this.localServices.setJsonValue("user", { id: userId, ...updatedUserAccounts })
                }
                this.helperServices.refreshAccessModules()
                this.isButtonLoading = false;
                this.router.navigate(["/admin/user-accounts"])
                this.dialogRef.close()
            }
          
        }, err => {
            this.helperServices.catchError(err, true, 3000, err.error.message);
            this.isButtonLoading = false;
            this.data.button_name = "Retry Update"
        })
    }

    activate_deactivate() {
        const { button_name, user: { id } } = this.data;
        if (button_name == "Deactivate" || button_name == "Re-Deactivate") {
            this.data.button_name = "Deactivating";
            this.isButtonLoading = true;
            this.userAccountServices.deactivateUserAccountById(id, "Deactivate").subscribe(res => {
                const isOk = this.helperServices.isOk(res);
                if (isOk) {
                    const { body: { isDeactivated, message } } = res;
                    this.isButtonLoading = false;
                    if (isDeactivated) {
                        this.snackBar.open(message, "", { duration: 3000 })
                        this.dialogRef.close({
                            id,
                            is_active: false
                        })
                    }
                }

            }, err => {
                this.isButtonLoading = false;
                this.data.button_name = "Re-Deactivate";
                const error = this.helperServices.catchError(err, false)
            })
        }

        if (button_name == "Activate" || button_name == "Re-Activate") {
            this.data.button_name = "Activating";
            this.isButtonLoading = true;
            this.userAccountServices.deactivateUserAccountById(id, "Activate").subscribe(res => {
                const isOk = this.helperServices.isOk(res);
                if (isOk) {
                    const { body: { isActivated, message } } = res;
                    this.isButtonLoading = false;
                    if (isActivated) {
                        this.snackBar.open(message, "", { duration: 3000 })
                        this.dialogRef.close({
                            id,
                            is_active: true
                        })
                    }
                }
            }, err => {
                this.isButtonLoading = false;
                this.data.button_name = "Re-Activate";
                const error = this.helperServices.catchError(err, true, 3000)
            })
        }
    }

    resetPassword() {
        const { user: { id } } = this.data;
        this.isButtonLoading = true;
        this.data.button_name = "Password Resetting";
        this.userAccountServices.resetPassword(id).subscribe(res => {
            const isOk = this.helperServices.isOk(res);
            if (isOk) {
                const { body: { message, isReset } } = res;
                this.isButtonLoading = false;
                this.snackBar.open(message, "", { duration: 3000 })
                if (isReset) {
                    this.dialogRef.close({
                        id,
                        isReset: true
                    })
                }
            }


        }, err => {
            this.helperServices.catchError(err, true, 3000)
            this.isButtonLoading = false;
            this.data.button_name = "Retry Reset Password";
        })
    }

    discard() {
        this.router.navigate(["/admin/user-accounts"])
        this.dialogRef.close();
    }
}