import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { BusinessModelServices } from "../business.model.service";

@Component({
    selector: 'app-business-model-dialog',
    templateUrl: './business.model.dialog.component.html',
    styleUrls: ['./business.model.dialog.component.scss']
})

export class BusinessModelDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<BusinessModelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private businessModelServices: BusinessModelServices,
        private helperServices: HelperServices,
        private snackbar: MatSnackBar
    ) { }

    businessModel: string = "";
    isCreating: boolean = false;
    buttonCreate: "Create" | "Creating..." = "Create";

    ngOnInit(): void {
        if (this.data.action == "UpdateBusinessModel") {
            this.businessModel = this.data.businessModel
        }
    }
    validateCreate() {
        if (this.businessModel.trim() == "") {
            return true
        }
        return false
    }
    createBusinessModel() {
        if (this.businessModel.trim() != "") {
            this.isCreating = true;
            this.buttonCreate = "Creating...";
            this.businessModelServices.createBusinessModel(this.businessModel).subscribe(res => {
                this.isCreating = false;
                this.buttonCreate = "Create";
                const { status, body: { message } } = res;
                if (status == 201) {
                    this.snackbar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({ isCreated: true })
                }
            }, err => {
                this.isCreating = false;
                this.buttonCreate = "Create";
                this.helperServices.catchError(err, true, 3000, "Business Model already exists")
            })
        }
    }
    cancelCreate() {
        this.dialogRef.close({ isCreated: false })
    }

    isUpdating: boolean = false;
    buttonUpdate: "Update" | "Updating..." = "Update";
    validateUpdate() {
        if (this.businessModel == this.data.businessModel || this.businessModel.trim() == "") {
            return true;
        }
        return false;
    }
    updateBusinessModel() {
        if (this.businessModel != this.data.businessModel && this.businessModel.trim() != "") {
            this.isUpdating = true;
            this.buttonUpdate = "Updating...";
            if (this.businessModel != this.data.businessModel) {
                this.businessModelServices.updateBusinessModel(this.data.businessModelId, this.businessModel).subscribe(res => {
                    this.isUpdating = false;
                    this.buttonUpdate = "Update";
                    const { status, body: { message, data } } = res;
                    if (status == 200) {
                        this.snackbar.open(message, "", { duration: 3000 })
                        this.dialogRef.close({ isUpdated: true, data })
                    }
                }, err => {
                    this.isUpdating = false;
                    this.buttonUpdate = "Update";
                    this.helperServices.catchError(err, true, 3000, "Business Model already exists")
                })
            }
        }
    }
    cancelUpdate() {
        this.dialogRef.close({ isUpdated: false })
    }


    isDeleting: boolean  = false;
    buttonDelete: "Delete" | "Deleting..." = "Delete";
    deleteBusinessModel() {
        this.isDeleting = true;
            this.buttonDelete = "Deleting...";
        this.businessModelServices.deleteBusinessModel(this.data.businessModelId).subscribe(res => {
            this.isDeleting = false;
            this.buttonDelete = "Delete";
            const { status, body: { message } } = res;
            if(status == 200) {
                this.snackbar.open(message, "", { duration: 3000 })
                this.dialogRef.close({ isDeleted: true })
            }
        }, err => {
            this.isDeleting = false;
            this.buttonDelete = "Delete";
            // this.helperServices.catchError(err, true, 3000, err.error.message)
            this.snackbar.open(err.error.message, "", { duration: 3000})
        })
    }
    cancelDelete() {
        this.dialogRef.close({isDeleted: false})
    }
}