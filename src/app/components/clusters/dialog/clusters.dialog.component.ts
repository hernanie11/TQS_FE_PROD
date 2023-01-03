import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ClusterServices } from "../clusters.service";

@Component({
    selector: 'app-cluster-dialog',
    templateUrl: './clusters.dialog.component.html',
    styleUrls: ['./clusters.dialog.component.scss']
})

export class ClustersDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ClustersDialogComponent>,
        private clusterServices: ClusterServices,
        private helperServices: HelperServices,
        private snackbar: MatSnackBar
    ) { }

    cluster: string = "";
    isCreatingCluster: boolean = false;
    buttonCreate: "Create" | "Creating..." = "Create";
    isUpdatingCluster: boolean = false;
    buttonUpdate: "Update" | "Updating..." = "Update";
    isDeletingCluster: boolean = false;
    buttonDelete: "Delete" | "Deleting..." = "Delete";
    ngOnInit(): void {
        if (this.data.action == "UpdateCluster") {
            this.cluster = this.data.cluster
        }
    }

    validateCreate() {
        if (this.cluster.trim() == "") {
            return true;
        }
        return false;
    }

    createCluster() {
        if (this.cluster.trim() != "") {
            this.buttonCreate = "Creating...";
            this.isCreatingCluster = true;
            this.clusterServices.createCluster(this.cluster).subscribe(res => {
                this.buttonCreate = "Create";
                this.isCreatingCluster = false;
                const { status, body: { message } } = res;
                if (status == 201) {
                    this.dialogRef.close({ isCreated: true })
                    this.snackbar.open(message, "", { duration: 3000 })
                }
            }, err => {
                this.buttonCreate = "Create";
                this.isCreatingCluster = false;
                this.helperServices.catchError(err, true, 3000, "Cluster already exists")
            })
        }

    }

    cancelCreate() {
        this.dialogRef.close({ isCreated: false })
    }

    validateUpdate() {
        if (this.cluster.trim() == this.data.cluster.trim() || this.cluster.trim() == "") {
            return true
        }
        return false;
    }

    updateCluster() {
        if (this.cluster != this.data.cluster && this.cluster.trim() != "") {
            this.isUpdatingCluster = true;
            this.buttonUpdate = "Updating...";
            this.clusterServices.updateCluster(this.data.clusterId, this.cluster).subscribe(res => {
                this.isUpdatingCluster = false;
                this.buttonUpdate = "Update";
                const { status, body: { message, data } } = res;
                if (status == 200) {
                    this.snackbar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({ isUpdated: true, data })
                }
            }, err => {
                this.isUpdatingCluster = false;
                this.buttonUpdate = "Update";
                this.helperServices.catchError(err, true, 3000, "Cluster already exists")
            })
        }
    }

    cancelUpdate() {
        this.dialogRef.close({ isUpdated: false })
    }

    deleteCluster() {
        this.isDeletingCluster = true;
        this.buttonDelete = "Deleting...";
        this.clusterServices.deleteCluster(this.data.clusterId).subscribe(res => {
            this.isDeletingCluster = false;
            this.buttonDelete = "Delete";
            const { status, body: { message } } = res;
            if (status == 200) {
                this.snackbar.open(message, "", { duration: 3000 })
                this.dialogRef.close({ isDeleted: true })
            }
        }, err => {
            this.isDeletingCluster = false;
            this.buttonDelete = "Delete";
            this.snackbar.open(err.error.message, "", { duration: 3000})
        })
    }
    cancelDelete() {
        this.dialogRef.close({ isDeleted: false })
    }

}