import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { StoreCodeDialogComponent } from "./dialog/store.code.dialog.component";
import { StoreCodesServices } from "./store.codes.service";

@Component({
    selector: 'app-store-codes',
    templateUrl: './store.codes.component.html',
    styleUrls: ['./store.codes.component.scss']
})

export class StoreCodesComponent {
    constructor(
        private storeCodesServices: StoreCodesServices,
        private helpersServices: HelperServices,
        private dialog: MatDialog
    ) { }
    @ViewChild(MatTable) table: MatTable<any>
    title: string = "Branch Codes";
    searchValue: string = "";
    dataSource = new MatTableDataSource<any>()
    isTableLoading: boolean = false;
    lblLoading: TextError = "Loading...";
    currentPage: number = 1;
    totalStoreCodes: number;
    storeCodePerPage: number = 5;
    pageSizeOption: any = [5, 10, 15, 20]
    searchStore() {
        this.isTableLoading = true;
        this.storeCodesServices.getStores(this.searchValue, this.currentPage, this.storeCodePerPage).subscribe(res => {
            
            this.isTableLoading = false;
            const isOk = this.helpersServices.isOk(res);
            if (isOk) {
                const { body: { data, total } } = res;
                if (data == 0) this.lblLoading = "No Data Found";
                this.dataSource.data = data
                this.totalStoreCodes = total;
            }
        }, err => {
            this.helpersServices.catchError(err, true, 3000)
        })
    }

    newStoreCode() {
        this.dialog.open(StoreCodeDialogComponent, {
            disableClose: true,
            data: {
                title: 'Create Store Code',
                action: 'CreateStoreCode'
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isCreated } = dialogResponse;
            if (isCreated) {
                this.populateStoreCodes()
            }
        })
    }
    
    editStoreCOde(storeCodeId: number, storeCode: string) {
        this.dialog.open(StoreCodeDialogComponent, {
            disableClose: true,
            data: {
                title: "Update Branch Code",
                action: "UpdateStoreCode",
                storeCodeId,
                storeCode
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isUpdated, updatedStoreCode } = dialogResponse;
            if (isUpdated) {
                let index = this.dataSource.data.findIndex((dt: any) => dt.id == updatedStoreCode.id)
                this.dataSource.data[index] = updatedStoreCode
                this.table.renderRows()
            }
        })
    }

    deleteStoreCode(storeCodeId: number) {
        this.dialog.open(StoreCodeDialogComponent, {
            disableClose: true,
            data: {
                title: "Delete Branch Code",
                question: "Are you sure you want to delete this Branch Code?",
                action: 'DeleteStoreCode',
                storeCodeId
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isDeleted } = dialogResponse;
            if(isDeleted) {
                this.populateStoreCodes()
            }
        })
    }

    clearSearch() {
        this.searchValue = "";
        this.populateStoreCodes()
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.storeCodePerPage = pageData.pageSize
        this.populateStoreCodes()
    }

    displayedColumns: string[] = [
        "id",
        "store_code",
        "actions"
    ]

    ngOnInit(): void {
        this.populateStoreCodes()
    }

    populateStoreCodes() {
        this.isTableLoading = true;
        this.storeCodesServices.getStores(this.searchValue, this.currentPage, this.storeCodePerPage).subscribe(res => {
            this.isTableLoading = false;
            const isOk = this.helpersServices.isOk(res);
            if (isOk) {
                const { body: { data, total } } = res;
                if (data == 0) this.lblLoading = "No Data";
                this.dataSource.data = data
                this.totalStoreCodes = total;
            }
        }, err => {
            const error = this.helpersServices.catchError(err, true, 3000)
            this.lblLoading = error
        })
    }



}