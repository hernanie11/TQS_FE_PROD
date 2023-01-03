import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { AreasServices } from "./areas.service";
import { AreasDialogComponent } from "./dialog/areas.dialog.component";

@Component({
    selector: 'app-areas',
    templateUrl: './areas.component.html',
    styleUrls: ['./areas.component.scss']
})

export class AreasComponent {
    constructor(
        private areasServices: AreasServices,
        private helperServices: HelperServices,
        private dialog: MatDialog
    ) { }
    title: string = "Areas";
    searchValue: string = "";
    dataSource = new MatTableDataSource<any>()
    isTableLoading: boolean = false;
    lblLoading: TextError = "Loading...";
    totalAreas: number;
    areaPerPage: number = 5;
    currentPage: number = 1;
    pageSizeOption: any = [5, 10, 15, 20]
    @ViewChild(MatTable) table: MatTable<any>
    searchStore() {
        this.isTableLoading = true;
        this.areasServices.getAreas(this.searchValue, this.currentPage, this.areaPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if (status == 200) {
                if (data == 0) this.lblLoading = "No Data Found";
                this.dataSource.data = data
                this.totalAreas = total
            }

        }, err => {
            this.isTableLoading = false;
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    newArea() {
        this.dialog.open(AreasDialogComponent, {
            disableClose: true,
            data: {
                title: "Create Area",
                action: "CreateArea"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isCreated } = dialogResponse;
            if (isCreated) {
                this.populateAreas()
            }
        })
    }
    
    editArea(areaId: number, area: string) {
        this.dialog.open(AreasDialogComponent, {
            disableClose: true,
            data: {
                title: "Update Area",
                areaId,
                area,
                action: "UpdateArea"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isUpdated, data } = dialogResponse;
            if (isUpdated) {
                let index = this.dataSource.data.findIndex((dt: any) => dt.id == data.id)
                this.dataSource.data[index] = data
                this.table.renderRows()
            }
        })
    }

    clearSearch() {
        this.searchValue = "";
        this.populateAreas()
    }

    deleteArea(areaId: number) {
       this.dialog.open(AreasDialogComponent, {
           disableClose: true,
           data: {
               title: "Delete Area",
               question: "Are you sure you want to delete this Area?",
               action: "DeleteArea",
               areaId
           }
       }).afterClosed().subscribe(dialogResponse => {
           const { isDeleted } = dialogResponse;
           if(isDeleted) {
               this.populateAreas()
           }
       })
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.areaPerPage = pageData.pageSize
        this.populateAreas()
    }

    ngOnInit(): void {
        this.populateAreas()
    }

    populateAreas() {
        this.isTableLoading = true;
        this.areasServices.getAreas(this.searchValue, this.currentPage, this.areaPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if (status == 200) {
                if (data == 0) this.lblLoading = "No Data";
                this.dataSource.data = data
                this.totalAreas = total
            }
        }, err => {
            this.isTableLoading = false;
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    displayedColumns: string[] = [
        "id",
        "store_code",
        "actions"
    ]

}