import { SelectionModel } from "@angular/cdk/collections";
import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { EarnedPointsDialogComponent } from "../dialog/earned.points.dialog.component";
import { EarnedPointsServices } from "../earned.points.service";

@Component({
    selector: 'app-earned-points',
    templateUrl: './earned.points.table.component.html',
    styleUrls: ['./earned.points.table.component.scss']
})

export class EarnedPointsTableComponent {

    constructor(
        private earnedPointsServices: EarnedPointsServices,
        private dialog: MatDialog,
        private snackbar: MatSnackBar
    ) { }

    /** @LifeCycles =============================================================== */
    ngOnInit(): void {
        this.populateEarnedPointsWithPaginator()
    }

    ngDoCheck(): void {
        this.checkSearchValue()
    }


    void(earnedPoint: number) {
        const randomText = (Math.random() + 1).toString(36).substring(7);
        this.dialog.open(EarnedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                action: "void",
                question: `Type ${randomText} to proceed`,
                button_name: "Void",
                earnedPoint,
                randomText
            }
        }).afterClosed().subscribe(res => {
            if (res.id) {
                let index = this.dataSource.data.findIndex((dt: any) => dt.id == res.id)
                this.dataSource.data[index].deleted_at = Date.now().toString()
                this.table.renderRows()
            }
        })
    }

    /** @States =============================================================== */
    title: string = "Earned Points Transactions";
    searchValue: string = "";
    isTableLoading: boolean = false;
    isSearched: boolean = false;
    currentPage = 1;
    @ViewChild("earnedPointsPaginator") memberPaginator: MatPaginator
    @ViewChild(MatTable) table: MatTable<any>
    dataSource = new MatTableDataSource<IEarnedPointsDataSource>()
    displayedColumns: string[] = [
        // "select",
        "id",
        "branch_code",
        "store",
        "transaction_no",
        "category",
        "first_name",
        "last_name",
        "mobile_number",
        "amount",
        "points_earn",
        // "status",
        "transaction_datetime",
        "actions",
    ]
    lblLoading: "Loading..." | "No Data" | "No Earned Points Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";
    pageSizeOption: number[] = [5, 10, 15, 20];
    earnedPointsPerPage: number = 5;
    totalMembers: number = 0;


    /** @Methods =============================================================== */
    populateEarnedPointsWithPaginator() {
        this.isTableLoading = true;
        this.earnedPointsServices.getEarnedPointsWithPaginator(this.currentPage, this.earnedPointsPerPage).subscribe(res => {
            console.log(res)
            this.isTableLoading = false;
            const { data, total } = res;
            if (data.length == 0) this.lblLoading = "No Data";
            this.dataSource.data = data;
            this.totalMembers = total;
            this.memberPaginator.length = total;
        }, err => {
            const { message } = err;
            switch (message) {
                case "Timeout has occurred":
                    this.lblLoading = "Server cannot be reach. Please Try Again Later";
                    this.isTableLoading = false;
            }
        })
    }

    checkSearchValue() {
        if (this.searchValue == "") if (this.isSearched) this.clearSearch()
    }

    searchEarnedPoints(isOnPage: boolean) {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.memberPaginator.pageIndex = 0;
            this.populateEarnedPointsWithPaginator();
        }
        else {
            if (!isOnPage) {
                this.currentPage = 1;
                this.memberPaginator.pageIndex = 0;
            }
            this.lblLoading = "Loading...";
            this.earnedPointsServices.searchEarnedPoints(this.searchValue, this.currentPage, this.earnedPointsPerPage).subscribe((res: any) => {
                const { data, total } = res;
                this.isSearched = true;
                this.isTableLoading = false;
                this.dataSource.data = data
                this.memberPaginator.length = total
                if (data.length == 0) { this.lblLoading = "No Earned Points Found" }
            })
        }
    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.earnedPointsPerPage = pageData.pageSize
            this.populateEarnedPointsWithPaginator()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.earnedPointsPerPage = pageData.pageSize
            this.searchEarnedPoints(true)
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateEarnedPointsWithPaginator()
        this.memberPaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    upload() {
        this.dialog.open(EarnedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Import Earned Points",
                action: "import-earned-points-validation"
            }
        }).afterClosed().subscribe(dialogRes => {
            const { isImported } = dialogRes;
            if (isImported) {
                this.populateEarnedPointsWithPaginator()
            }
        })
    }

    selection: any = new SelectionModel<any>(true, []);
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    clearEarnedPoints() {
        const selectedEarnedPoints: SelectedEarnedPoints = this.selection.selected.map((earnedPoints: IEarnedPointsDataSource) => {
            const { id, member_id, amount, points_earn } = earnedPoints;
            return {
                id,
                member_id,
                amount,
                points_earn
            }
        })
        this.dialog.open(EarnedPointsDialogComponent, {
            data: {
                title: 'Confirmation',
                question: 'are you sure you want to add these selected earned points to cleared points?',
                button_name: 'Add',
                action: 'add-to-cleared-points',
                selectedEarnedPoints
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { code } = dialogResponse;
            if (code == "201") {
                this.populateEarnedPointsWithPaginator()
            }
        })
    }

    validateClearedPoints() {
        if (this.selection.selected == 0) return true;
        return false;
    }
}

type SelectedEarnedPoints = Pick<IEarnedPointsDataSource, "id" | "member_id" | "amount" | "points_earn">

interface IEarnedPointsDataSource {
    id: number;
    member_id: number;
    first_name: string;
    last_name: string;
    mobile_number: string;
    transaction_no: string;
    amount: number;
    points_earn: number;
    transaction_datetime: string;
    deleted_at: string
}