import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { MembersDialogComponent } from "../../dialog/members.dialog.component";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class OverviewComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private credServices: CredServices,
        private router: Router
    ) {} 

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.ctrlKey && e.key == "ArrowLeft") {
            this.back()
        }
    }
   
    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }

    back() {
        this.membersRegisterServices.steps = "Cooking";
    }

    createMember() {
        const memberForm = {
            first_name: this.membersRegisterServices.first_name,
            last_name: this.membersRegisterServices.last_name,
            gender: this.membersRegisterServices.gender,
            birthday: this.membersRegisterServices.birthday,
            email: this.membersRegisterServices.email,
            barangay: this.membersRegisterServices.addressForm.value.barangay,
            municipality: this.membersRegisterServices.municipality,
            province: this.membersRegisterServices.province,
            mobile_number: this.membersRegisterServices.mobile_number,
            created_by: this.credServices.getCredentials().client_user.user_mysql_id,
            store_mysql_id: this.credServices.getCredentials().activated_store.store_mysql_id
        }
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                memberForm,
                title: "Confirmation",
                question: "Are you sure you want to create this member?",
                button_name: "Create",
                action: 'createMemberInStore'
            }
        }).afterClosed().subscribe(dialogResponse => {
            if(dialogResponse.error) {
                this.snackBar.open(dialogResponse.error.message, "", {
                    duration: 3000
                })
            }
            
            if(dialogResponse.isCreated) {
                this.snackBar.open(dialogResponse.res.message, "", {
                    duration: 3000
                })
                this.membersRegisterServices.buttonName = "CREATED";
                this.router.navigate(['/client/transactions'])
            }
          
        })
        
    }

}