import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ClusterServices } from "./clusters.service";
import { ClustersDialogComponent } from "./dialog/clusters.dialog.component";

@Component({
    selector: 'app-clusters',
    templateUrl: './clusters.component.html',
    styleUrls: ['./clusters.component.scss']
})

export class ClustersComponent {
    constructor(
        private clustersServices: ClusterServices,
        private helpersServices: HelperServices,
        private dialog: MatDialog
    ) {}
    title: string = "Clusters";
    searchValue: string = "";
    dataSource = new MatTableDataSource<any>()
    isTableLoading: boolean = false;
    lblLoading: TextError = "Loading...";
    totalClusters: number;
    currentPage: number = 1;
    clusterPerPage: number = 5; 
    pageSizeOption: any = [5, 10, 15, 20]
    @ViewChild(MatTable) table: MatTable<any>
    searchStore() {
        this.isTableLoading = true
        this.clustersServices.getClusters(this.searchValue, this.currentPage, this.clusterPerPage).subscribe(res => {
            this.isTableLoading = false
            const { status, body: {data, total} } = res;
            if(status == 200) {
                if(data == 0) this.lblLoading = "No Data Found";
                this.dataSource.data = data;
                this.totalClusters = total;
            }
        }, err => {
            const error = this.helpersServices.catchError(err, true, 3000)
            this.lblLoading = error
        })
    }

    newCluster() {
        this.dialog.open(ClustersDialogComponent, {
            disableClose: true,
            data: {
                title: "Create Cluster",
                action: "CreateCluster"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isCreated } = dialogResponse;
            if(isCreated) {
                this.populateClusters()
            }
        })
    }

    editCluster(clusterId: number, cluster: string) {
        this.dialog.open(ClustersDialogComponent, {
            disableClose: true, 
            data: {
                title: "Update Cluster",
                clusterId,
                cluster,
                action: "UpdateCluster"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isUpdated, data } = dialogResponse;
            if(isUpdated) {
                let index = this.dataSource.data.findIndex((dt: any) => dt.id == data.id)
                this.dataSource.data[index] = data
                this.table.renderRows()
            }
        })
    }

    deleteCluster(clusterId: number) {
        this.dialog.open(ClustersDialogComponent, {
            disableClose: true,
            data: {
                title: "Delete Cluster",
                question: "Are you sure you want to delete this cluster?",
                clusterId,
                action: "DeleteCluster"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isDeleted } = dialogResponse;
            if(isDeleted) this.populateClusters()
        })
    }

    clearSearch() {
        this.searchValue = "";
        this.populateClusters()
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.clusterPerPage = pageData.pageSize
        this.populateClusters()
    }

    displayedColumns: string[] = [
        "id",
        "store_code",
        "actions"
    ]

    ngOnInit(): void {
        this.populateClusters()
    }

    populateClusters() {
        this.isTableLoading = true;
        this.clustersServices.getClusters(this.searchValue, this.currentPage, this.clusterPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: {data, total} } = res;
            if(status == 200) {
                if(data == 0) this.lblLoading = "No Data";
                this.dataSource.data = data;
                this.totalClusters = total;
            }
        }, err => {
            const error = this.helpersServices.catchError(err, true, 3000)
            this.lblLoading = error
        })
    }

}