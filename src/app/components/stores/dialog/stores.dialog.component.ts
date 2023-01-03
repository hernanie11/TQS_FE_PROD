import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-dialog',
    templateUrl: './stores.dialog.component.html',
    styleUrls: ['./stores.dialog.component.scss']
})

export class StoresDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<StoresDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storesServices: StoresServices,
        private snackBar: MatSnackBar,
        private router: Router,
        private helperServices: HelperServices
    ) { }

    /** @States ====================================================== */
    isButtonLoading: boolean = false;

    /** @Methods ===================================================== */
    create() {
        const { storeForm } = this.data;
        this.isButtonLoading = true;
        this.data.button_name = "Creating"
        this.storesServices.createStore(storeForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Create";
            const { status, body: { message } } = res;
            if(status == 201) {
                this.snackBar.open(message, "", { duration: 3000 })
                this.router.navigate(["/admin/stores"])
                this.dialogRef.close()
            }
        }, err => {
            this.isButtonLoading = false;
            this.data.button_name = "Create"
            this.helperServices.catchError(err, true, 3000, "Store Code is already exists")
        })
    }

    update() {
        this.isButtonLoading = true;
        const { storeId, storeForm } = this.data;
        this.data.button_name = "Updating...";
        this.storesServices.updateStoreById(storeId, storeForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Update";
            const { isUpdated, message } = res;
            this.snackBar.open(message, "", { duration: 3000 })
            if(isUpdated) {
                this.router.navigate(["/admin/stores"])
                this.dialogRef.close()
            }
        })
    }

    ActivateInActive() {
        this.isButtonLoading = true;
        if(this.data.button_name == "Deactivate") {
            this.data.button_name = "Deactivating";
            const { store: { id } } = this.data;
            if(this.data.button_name == "Deactivating") {
                this.storesServices.updateStoreStatus(id, false).subscribe(res => {
                    const { status, body: { message } } = res;
                    if(status == 200) {
                        this.data.button_name = "Deactivate";
                        this.snackBar.open(message, "", { duration: 3000 })
                        this.dialogRef.close({
                            storeId: id,
                            status: 'Inactive'
                        })
                    }
                }, err => {
                    this.helperServices.catchError(err, true, 3000)
                })
            }
        }
        if(this.data.button_name == "Activate") {
            this.data.button_name = "Activating";
            const { store: { id } } = this.data;
            this.storesServices.updateStoreStatus(id, true).subscribe(res => {
                const  { status, body: { message } } = res;
                if(status == 200) {
                    this.data.button_name = "Activate";
                    this.snackBar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({
                        storeId: id,
                        status: "Active",
                    })
                }
            }, err => {
                this.helperServices.catchError(err, true, 3000)
            })
        }
    }

    discard() {
        this.router.navigate(["/admin/stores"])
        this.dialogRef.close()
    }

    buttonGenerate: "Generate" | "Generating..." = "Generate";
    isGenerating: boolean = false;
    generateToken() {
        this.isGenerating = true;
        this.storesServices.generateNewToken(this.data.store_id).subscribe(res => {
            this.isGenerating = false;
            const { status, body: { message } } = res;
            if(status == 201) {
                this.snackBar.open(message, "", { duration: 3000})
                this.dialogRef.close({isGenerated: true})
            }
        }, err => {
            this.helperServices.catchError(err, true, 3000)
        })
    }

    cancelGenerateToken() {
        this.dialogRef.close({ isGenerated: false })
    }

    buttonRemoveToken: "Remove" | "Removing..." = "Remove"
    isRemoving: boolean = false
    removeToken() {
        this.buttonRemoveToken = "Removing..."
        this.isRemoving = true
        this.storesServices.removeToken(this.data.tokenId).subscribe(res => {
            this.buttonRemoveToken = "Remove"
            this.isRemoving = false;
            const { status, body: { message } } = res;
            if(status == 200) {
                this.snackBar.open(message, "", { duration: 3000 })
                this.dialogRef.close({ isRemoved: true })
            }
        }, err => {
            this.buttonRemoveToken = "Remove"
            this.isRemoving = false;
            this.helperServices.catchError(err, true, 3000)
        })
    }
}