import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { AreasServices } from "../areas.service";

@Component({
    selector: 'app-areas-dialog',
    templateUrl: './areas.dialog.component.html',
    styleUrls: ['./areas.dialog.component.scss']
})

export class AreasDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<AreasDialogComponent>,
        private areasServices: AreasServices,
        private snackbar: MatSnackBar,
        private helperServices: HelperServices
    ) {}

    area: string = "";
    isAreaCreating: boolean = false;
    buttonCreate: "Create"| "Creating..." = "Create";
    isUpdatingArea: boolean = false;
    buttonUpdate: "Update" | "Updating..." = "Update";

    isDeletingArea: boolean = false;
    buttonDelete: "Delete" | "Deleting..." = "Delete";
    ngOnInit(): void {
        if(this.data.action == "UpdateArea")     {
            this.area = this.data.area
        }
    }

    validateCreate() {
        if(this.area.trim() == "") {
            return true
        }
        return false;
    }

    createArea() {
        if(this.area.trim() != "") {
            this.buttonCreate = "Creating...";
            this.isAreaCreating = true;
            this.areasServices.createArea(this.area).subscribe(res => {
                this.buttonCreate = "Create";
                this.isAreaCreating = false;
                const { status, body: { message } } = res;
                if(status == 201) {
                    this.snackbar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({ isCreated: true })
                }
            }, err => {
                this.buttonCreate = "Create";
                this.isAreaCreating = false;
                this.helperServices.catchError(err, true, 3000, err.error.errors.area[0])
            })
        }
        
    }

    cancelCreate() {
        this.dialogRef.close({ isCreated: false })
    }

    validateUpdate() {
        if(this.area == this.data.area || this.area.trim() == "") {
            return true
        }
        return false;
    }

    updateArea() {
        if(this.area != this.data.area && this.area.trim() != "") {
            this.isUpdatingArea = true
            this.buttonUpdate = "Updating...";
            this.areasServices.updateArea(this.data.areaId, this.area).subscribe(res => {
                this.isUpdatingArea = false
                this.buttonUpdate = "Update";
                const { status, body: { data, message } } = res;
                if(status == 200) {
                    this.snackbar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({ isUpdated: true, data})
                }
            }, err => {
                this.isUpdatingArea = false
                this.buttonUpdate = "Update";
                this.helperServices.catchError(err, true, 3000, "Area is already exists")
            })
        }
    }

    cancelUpdate() {
        this.dialogRef.close({ isUpdated: false })
    }

    deleteArea() {
        this.buttonDelete = "Deleting...";
        this.isDeletingArea = true;

        this.areasServices.deleteArea(this.data.areaId).subscribe(res => {
            this.buttonDelete = "Delete";
            this.isDeletingArea = false;
            const { status, body: { message } } = res;
            if(status == 200) {
                this.snackbar.open(message, "", { duration: 3000 })
                this.dialogRef.close({ isDeleted: true })
            }
        }, err => {
            this.buttonDelete = "Delete";
            this.isDeletingArea = false;
            this.snackbar.open(err.error.message, "", { duration: 3000})
        })
    }

    cancelDelete() {
        this.dialogRef.close({ isDeleted: false })
    }
}