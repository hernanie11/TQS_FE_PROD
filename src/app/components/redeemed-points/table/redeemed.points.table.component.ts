import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { RedeemedPointsDialogComponent } from "../dialog/redeemed.points.dialog.component";
import { RedeemedPointsServices } from "../redeemed-points.service";

@Component({
    selector: 'app-redeemed-points-table',
    templateUrl: './redeemed.points.table.component.html',
    styleUrls: ['./redeemed.points.table.component.scss']
})

export class RedeemedPointsTableComponent {

    constructor(
        private redeemedPointsServices: RedeemedPointsServices,
        private dialog: MatDialog
    ) { }

    /** @States ========================================*/
    title: string = "Redeemed Points Transactions";
    isTableLoading: boolean = false;
    searchValue: string = "";
    isSearched: boolean = false;
    currentPage = 1;
    redeemedPointsPerPage: number = 5;
    totalRedeemedPoints: number = 0;
    pageSizeOption: number[] = [5, 10, 15, 20];
    @ViewChild("redeemedPointsPaginator") redeemedPointsPaginator: MatPaginator
    @ViewChild(MatTable) table: MatTable<any>
    dataSource = new MatTableDataSource<any>()
    displayedColumns: string[] = [
        "id",
        "first_name",
        "last_name",
        "store",
        "points_redeemed",
        "date_redeemed",
        "actions",

    ]
    lblLoading: "Loading..." | "No Data" | "No Redeemed Points Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";

    /** @LifeCycles */

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.populateRedeemedPointsWithPaginator()
    }

    /** @METHODS  =====================================*/

    populateRedeemedPointsWithPaginator() {
        this.isTableLoading = true;
        this.lblLoading = "Loading...";
        this.redeemedPointsServices.populateRedeemedPoints(this.currentPage, this.redeemedPointsPerPage).subscribe(res => {
            const { data, total } = res;
            this.totalRedeemedPoints = total;
            this.dataSource.data = data;
            this.isTableLoading = false;
            if (data.length == 0) this.lblLoading = "No Redeemed Points Found";
        })
    }

    searchRedeemedPoints(isOnPage: boolean) {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.redeemedPointsPaginator.pageIndex = 0;
            this.populateRedeemedPointsWithPaginator();
        }
        else {
            if (!isOnPage) {
                this.currentPage = 1;
                this.redeemedPointsPaginator.pageIndex = 0;
            }
            this.lblLoading = "Loading...";
            this.redeemedPointsServices.searchRedeemedPoints(this.searchValue, this.currentPage, this.redeemedPointsPerPage).subscribe((res: any) => {
                const { data, total } = res;
                this.isSearched = true;
                this.isTableLoading = false;
                this.dataSource.data = data
                this.redeemedPointsPaginator.length = total
                if (data.length == 0) { this.lblLoading = "No Redeemed Points Found" }
            })
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateRedeemedPointsWithPaginator()
        this.redeemedPointsPaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.redeemedPointsPerPage = pageData.pageSize
            this.populateRedeemedPointsWithPaginator()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.redeemedPointsPerPage = pageData.pageSize
            this.searchRedeemedPoints(true)
        }
    }

    void(redeemedPointId: number) {
        const randomText = (Math.random() + 1).toString(36).substring(7);
        this.table.renderRows()
        this.dialog.open(RedeemedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                action: "void",
                question: `Type ${randomText} to proceed`,
                button_name: "Void",
                redeemedPointId,
                randomText
            }
        }).afterClosed().subscribe(res => {
            if (res.id) {
                let index = this.dataSource.data.findIndex((dt: any) => dt.id == res.id)
                this.dataSource.data[index].deleted_at = Date.now().toString();
                
                this.table.renderRows()
            }
        })
    }
}