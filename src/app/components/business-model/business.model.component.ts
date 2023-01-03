import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { BusinessModelServices } from "./business.model.service";
import { BusinessModelDialogComponent } from "./dialog/business.model.dialog.component";

@Component({
    selector: 'app-business-model',
    templateUrl: './business.model.component.html',
    styleUrls: ['./business.model.component.scss']
})

export class BusinessModelComponent {
    constructor(
        private businessModelServices: BusinessModelServices,
        private helperServices: HelperServices,
        private dialog: MatDialog
    ) { }
    title: string = "Business Model";
    searchValue: string = "";
    dataSource = new MatTableDataSource<any>()
    isTableLoading: boolean = false;
    lblLoading: TextError = "Loading...";
    totalBusinessModel: number = 0;
    businessModelPerPage: number = 5;
    currentPage: number = 1;
    pageSizeOption: any = [5, 10, 15, 20]
    searchStore() {
        this.isTableLoading = true;
        this.businessModelServices.getBusinessModels(this.searchValue, this.currentPage, this.businessModelPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if (status == 200) {
                if (data == 0) this.lblLoading = "No Data Found";
                this.dataSource.data = data
                this.totalBusinessModel = total;
            }
        }, err => {
            this.helperServices.catchError(err, true, 3000)
            this.isTableLoading = false;
        })
    }

    newBusinessModel() {
        this.dialog.open(BusinessModelDialogComponent, {
            disableClose: true,
            data: {
                title: "Create Business Model",
                action: "CreateBusinessModel"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isCreated } = dialogResponse;
            if (isCreated) {
                this.populateBusinesModel()
            }
        })
    }

    @ViewChild(MatTable) table: MatTable<any>
    editBusinessModel(businessModelId: number, businessModel: string) {
        this.dialog.open(BusinessModelDialogComponent, {
            disableClose: true,
            data: {
                title: "Update Business Model",
                action: "UpdateBusinessModel",
                businessModelId,
                businessModel
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isUpdated, data } = dialogResponse;
            if(isUpdated) {
                let index = this.dataSource.data.findIndex((dt: any) => dt.id == data.id)
                this.dataSource.data[index] = data;
                this.table.renderRows()
            }
        })
    }

    clearSearch() {
        this.searchValue = ""
        this.populateBusinesModel()
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.businessModelPerPage = pageData.pageSize
        this.populateBusinesModel()
    }

    displayedColumns: string[] = [
        "id",
        "store_code",
        "actions"
    ]

    ngOnInit(): void {
        this.populateBusinesModel()
    }

    populateBusinesModel() {
        this.isTableLoading = true;
        this.businessModelServices.getBusinessModels(this.searchValue, this.currentPage, this.businessModelPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if (status == 200) {
                if (data == 0) this.lblLoading = "No Data";
                this.dataSource.data = data
                this.totalBusinessModel = total;
            }
        }, err => {
            this.isTableLoading = false;
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error
        })
    }

    deleteBusinessModel(businessModelId: number) {
        this.dialog.open(BusinessModelDialogComponent, {
            disableClose: true,
            data: {
                title: "Delete Business Model",
                question: "Are you sure you want to delete this business model?",
                action: "DeleteBusinessModel",
                businessModelId
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isDeleted } = dialogResponse;
            if(isDeleted) [
                this.populateBusinesModel()
            ]
        })
    }
}