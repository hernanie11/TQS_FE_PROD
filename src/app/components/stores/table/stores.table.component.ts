import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { StoresDialogComponent } from "../dialog/stores.dialog.component";
import { StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-table',
    templateUrl: './stores.table.component.html',
    styleUrls: ['./stores.table.component.scss']
})

export class StoresTableComponent {

    constructor(
        private storesServices: StoresServices,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private helperServices: HelperServices
    ) { }

    /** @LifeCycles ========================================================= */
    ngOnInit(): void {
        this.populateStoresWithPaginator()
    }

    /** @States ========================================================= */
    title: string = "Stores";
    searchValue: string = "";
    isSearched: boolean = false;
    pageSizeOption: number[] = [5, 10, 15, 20];
    storesPerPage: number = 5;
    totalItems: number = 0;
    currentPage = 1;
    dataSource = new MatTableDataSource<IStoreDataSource>();
    isTableLoading: boolean = false;
    lblLoading: TextError;
    @ViewChild("storePaginator") storePaginator: MatPaginator
    displayedColumns: string[] = [
        'id',
        'code',
        'name',
        'area',
        'region',
        'cluster',
        'business_model',
        'is_active',
        'created_at',
        'actions',
    ];

    checkSearchValue() {
        if (this.searchValue == "") {
            if (this.isSearched) {
                this.clearSearch()
            }
        }
    }

    populateStoresWithPaginator() {
        this.isTableLoading = true;
        this.lblLoading = "Loading...";
        this.storesServices.getStoresWithPaginator(this.searchValue, this.currentPage, this.storesPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if(status == 200) {
                if(data == 0) this.lblLoading = "No Data";
                this.totalItems = total
                this.dataSource.data = data;
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    searchStore() {
        this.isTableLoading = true;
        this.lblLoading = "Loading...";
        this.storesServices.getStoresWithPaginator(this.searchValue, this.currentPage, this.storesPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if(status == 200) {
                if(data == 0) this.lblLoading = "No Data Found";
                this.totalItems = total
                this.dataSource.data = data;
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateStoresWithPaginator()
        this.storePaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    editStore(storeId: number) {
        this.router.navigate(["/admin/stores/edit/", { storeId }])
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.storesPerPage = pageData.pageSize;
        this.populateStoresWithPaginator()
    }

    newStore() {
        this.router.navigate(["/admin/stores/new"])
    }

    activateInactivate(action: string, store: any) {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: `Are you sure want to ${action} this store?`,
                action: "activeInActive",
                button_name: action,
                store
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { storeId, status } = dialogResponse;
            if (status) {
                let index = this.dataSource.data.findIndex((store: any) => store.id == storeId)
                this.dataSource.data[index].status = status;
                this.dataSource.data[index].hasChanged = true;
            }

        })

    }

    copyToken(code: number) {
        this.snackBar.open(`Code # ${code}`, `Token Copied to Clipboard`, { duration: 3000 })
    }
}

interface IStoreDataSource {
    id: number;
    code: string;
    name: string;
    area: string;
    region: string;
    cluster: string;
    business_model: string;
    created_at: string;
    status: string;
    hasChanged?: boolean
}