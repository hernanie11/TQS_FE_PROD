import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { RegionService } from "../region.service";

@Component({
    selector: 'app-region-dialog',
    templateUrl: './region.dialog.component.html',
    styleUrls: ['./region.dialog.component.scss']
})

export class RegionDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<RegionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private helperServices: HelperServices,
        private regionServices: RegionService,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if(this.data.action == "UpdateRegion") {
            this.region = this.data.region
        }
    }

    region: string = ""
    validateCreate() {
        if(this.region.trim() == "") {
            return true
        }
        return false;
    }

    isCreating: boolean = false;
    buttonCreate: "Create" | "Creating..." = "Create";
    createRegion() {
        if(this.region.trim() != "") {
            this.isCreating = true;
            this.buttonCreate = "Creating...";
            this.regionServices.createRegion(this.region).subscribe(res => {
                this.isCreating = false;
                this.buttonCreate = "Create";
                const { status, body: { message } } = res;
                if(status == 201) {
                    this.snackbar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({ isCreated: true })
                }
            }, err => {
                this.isCreating = false;
                this.buttonCreate = "Create";
                this.helperServices.catchError(err, true, 3000, "Region is already exists")
            })
        }
      
    }

    cancelCreate() {
        this.dialogRef.close({ isCreated: false })
    }


    validateUpdate() {
        if(this.region.trim() == this.data.region.trim() || this.region.trim() == "") {
            return true
        }
        return false;
    }
    
    isUpdating: boolean = false;
    buttonUpdate: "Update" | "Updating..." = "Update";
    updateRegion() {
        this.isUpdating = true;
        this.buttonUpdate = "Updating..."
        this.regionServices.updateRegion(this.data.regionId, this.region).subscribe(res => {
            const { status, body: { message, data } } = res;
            if(status == 200) {
                this.snackbar.open(message, "", { duration: 3000 })
                this.dialogRef.close({ isUpdated: true, data})
            }
        }, err => {
            this.helperServices.catchError(err, true, 3000, err.error.message)
            this.buttonUpdate="Update";
            this.isUpdating = false;
        })
    }
    cancelUpdate() {
        this.dialogRef.close({ isUpdated: false })
      
    }

    isDeleting: boolean = false;
    buttonDelete: "Delete" | "Deleting..." = "Delete";
    deleteRegion() {
        this.isDeleting = true;
        this.buttonDelete = "Deleting...";
        this.regionServices.deleteRegion(this.data.regionId).subscribe(res => {
            const { status, body: { message } } = res;
            if(status == 200) {
                this.snackbar.open(message, "", { duration: 3000 })
                this.dialogRef.close({isDeleted: true})
            }
        }, err => {
            this.snackbar.open(err.error.message, "", { duration: 3000})
            this.buttonDelete="Delete";
            this.isDeleting = false;
        })
    }
    cancelDelete() {
        this.dialogRef.close({ isDeleted: false })
    }
}