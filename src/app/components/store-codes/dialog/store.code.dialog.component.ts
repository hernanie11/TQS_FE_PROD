import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { StoreCodesServices } from "../store.codes.service";

@Component({
    selector:'app-store-code-dialog',
    templateUrl: './store.code.dialog.component.html',
    styleUrls: ['./store.code.dialog.component.scss']
})

export class StoreCodeDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<StoreCodeDialogComponent>,
        private fb: FormBuilder,
        private storeCodeServices: StoreCodesServices,
        private helperServices: HelperServices,
        private snackbar: MatSnackBar
    ) {}
    
    isCreatingStoreCode: boolean = false;
    storeCode: string = "";
    buttonName: "Create" | "Creating..." = "Create";
    updateButtonName: "Update" | "Updating..." = "Update";
    isUpdatingStoreCode: boolean = false;

    deleteButtonName: "Delete" | "Deleting..." = "Delete";
    isDeletingStoreCode: boolean = false;
    ngOnInit(): void {
        if(this.data.action == "UpdateStoreCode") {
            this.storeCode = this.data.storeCode
        }
    }

    validateCreate() {
        if(this.storeCode.trim() == "") {
            return true
        }
        return false;
    }
    createStoreCode() {
        if(this.storeCode.trim() != "") {
            this.buttonName = "Creating..."
        this.isCreatingStoreCode = true;
        this.storeCodeServices.createStoreCode(this.storeCode).subscribe(res => {
            this.isCreatingStoreCode = false;
            this.buttonName = "Create"
            const { status, body: { message } } = res;
            if(status == 201) {
                this.dialogRef.close({ isCreated: true })
                this.snackbar.open(message, "" , { duration: 3000 })
            }
        }, err => {
            this.isCreatingStoreCode = false;
            this.buttonName = "Create"
            this.helperServices.catchError(err, true, 3000, err.error.errors.store_code[0])
            
        })
        }
    }
   
    cancel() {
        this.dialogRef.close({isCreated: false})
    }

    validateUpdate() {
        if(this.storeCode == this.data.storeCode || this.storeCode.trim() == "") {
            return true
        }
        return false;
    }

    updateStoreCode() {
        if(this.storeCode != this.data.storeCode && this.storeCode.trim() != "")  {
            this.updateButtonName = "Updating...";
            this.isUpdatingStoreCode = true;
            this.storeCodeServices.updateStoreCode(this.data.storeCodeId, this.storeCode).subscribe(res => {
                this.updateButtonName = "Update";
                this.isUpdatingStoreCode = false;
                const { body: { message, data } } = res;
                this.snackbar.open(message, "", { duration: 3000 })
                this.dialogRef.close({isUpdated: true, updatedStoreCode: data})
            }, err => {
                this.helperServices.catchError(err, true, 3000, err.error.message)
                this.isUpdatingStoreCode = false;
                this.updateButtonName = "Update";
            })
        }
    }

    cancelUpdate() {
        this.dialogRef.close({ isUpdated: false })
    }


    deleteStoreCode() {
        this.isDeletingStoreCode = true;
        this.deleteButtonName = "Deleting...";
        this.storeCodeServices.deleteStoreCode(this.data.storeCodeId).subscribe(res => {
            console.log(res)
            this.isDeletingStoreCode = false;
            this.deleteButtonName = "Delete";
            const { status, body: { message } } = res;
            if(status == 200) {
                this.snackbar.open(message, "", { duration: 3000 })
            }
            this.dialogRef.close({ isDeleted: true })
        }, err => {
            console.log(err)
            this.isDeletingStoreCode = false;
            this.deleteButtonName = "Delete";
            this.snackbar.open(err.error.message, "", { duration: 3000})
        })
    }

    cancelDelete() {
        this.dialogRef.close({ isDeleted: false })
    }
}