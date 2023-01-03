import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ClearedPointsServices } from "../cleared.points.service";
import { ClearedPointsDialogComponent } from "../dialog/cleared.points.dialog.component";

@Component({
    selector: 'app-cleared-points',
    templateUrl: './cleared.points.table.component.html',
    styleUrls: ['./cleared.points.table.component.scss']
})

export class ClearedPointsTableComponent {

    constructor(
        private clearedPointsServices: ClearedPointsServices,
        private dialog: MatDialog
    ) { }

    title: string = "Cleared Points";
    searchValue: string = ""
    isTableLoading: boolean = false;
    isSearched: boolean = false;
    @ViewChild("clearedPointsPaginator") clearedPointsPaginator: MatPaginator
    currentPage = 1;
    pageSizeOption: number[] = [5, 10, 15, 20];
    clearedPointsPerPage: number = 5;
    totalClearedPoints: number = 0;
    dataSource = new MatTableDataSource<any>()
    displayedColumns: string[] = [
        "id",
        "mobile_number",
        "first_name",
        "last_name",
        "cleared_points",
        "actions",
    ]
    lblLoading: "Loading..." | "No Data" | "No Cleared Points Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";

    /** @LifeCycles =============================================================== */
    ngOnInit(): void {
        this.populateClearedPointsWithPaginator()
    }

    ngDoCheck(): void {
        this.checkSearchValue()
    }

    checkSearchValue() {
        if (this.searchValue == "") if (this.isSearched) this.clearSearch()
    }

    populateClearedPointsWithPaginator() {
        this.isTableLoading = true;
        this.dataSource.data = []
        this.lblLoading = "Loading...";
        this.clearedPointsServices.getClearedPointsWithPaginator(this.searchValue,this.currentPage, this.clearedPointsPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { data, total } = res;
            if (data.length == 0) this.lblLoading = "No Data";
            this.dataSource.data = data;
            this.totalClearedPoints = total;
            this.clearedPointsPaginator.length = total;
        }, err => {
            const { message } = err;
            switch (message) {
                case "Timeout has occurred":
                    this.lblLoading = "Server cannot be reach. Please Try Again Later";
                    this.isTableLoading = false;
            }
        })
    }

    searchClearedPoints(isOnPage: boolean) {
        this.isTableLoading = true;
        this.dataSource.data = []
        this.lblLoading = "Loading...";
        this.clearedPointsServices.getClearedPointsWithPaginator(this.searchValue,this.currentPage, this.clearedPointsPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { data, total } = res;
            if (data.length == 0) this.lblLoading = "No Cleared Points Found";
            this.dataSource.data = data;
            this.totalClearedPoints = total;
            this.clearedPointsPaginator.length = total;
        }, err => {
            const { message } = err;
            switch (message) {
                case "Timeout has occurred":
                    this.lblLoading = "Server cannot be reach. Please Try Again Later";
                    this.isTableLoading = false;
            }
        })
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateClearedPointsWithPaginator()
        this.clearedPointsPaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.clearedPointsPerPage = pageData.pageSize
            this.populateClearedPointsWithPaginator()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.clearedPointsPerPage = pageData.pageSize
            this.searchClearedPoints(true)
        }
    }

    viewSOA(memberId: number) {
        this.dialog.open(ClearedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Earned and Redeemed points history",
                action: "soa",
                memberId
            }
        })
    }

    upload() {
        this.dialog.open(ClearedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Upload Cleared Points",
                action: 'uploadClearedPoints'
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isUploaded } = dialogResponse
            if (isUploaded) {
                this.populateClearedPointsWithPaginator()
            }
        })
    }
}