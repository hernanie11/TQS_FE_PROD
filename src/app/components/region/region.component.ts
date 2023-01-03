import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { RegionDialogComponent } from "./dialog/region.dialog.component";
import { RegionService } from "./region.service";

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.scss']
})
export class RegionComponent {

    constructor(
        private regionServices: RegionService,
        private helperServices: HelperServices,
        private dialog: MatDialog
    ) {}

    title: string = "Regions"
    searchValue: string = "";
    dataSource = new MatTableDataSource<any>()
    isTableLoading: boolean = false;
    lblLoading: TextError = "Loading...";
    currentPage: number = 1;
    totalRegions: number;
    regionPerPage: number = 5;
    pageSizeOption: any = [5, 10, 15, 20]
    displayedColumns: string[] = [
        "id",
        "region",
        "actions"
    ]

    ngOnInit(): void {
        this.populateRegions()    
    }

    searchRegion() {
        this.isTableLoading = true;
        this.regionServices.getRegions(this.searchValue, this.currentPage, this.regionPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total} } = res;
            if(status == 200) {
                if(data == 0) this.lblLoading = "No Data Found";
                this.dataSource.data = data;
                this.totalRegions = total;
            }
        }, err => {
            this.isTableLoading = false;
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    clearSearch() {
        this.searchValue = ""
        this.populateRegions()
    }

    populateRegions() {
        this.isTableLoading = true;
        this.regionServices.getRegions(this.searchValue, this.currentPage, this.regionPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total} } = res;
            if(status == 200) {
                if(data == 0) this.lblLoading = "No Data";
                this.dataSource.data = data;
                this.totalRegions = total;
            }
        }, err => {
            this.isTableLoading = false;
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }
    
    newRegion() {
        this.dialog.open(RegionDialogComponent, {
            disableClose: true,
            data: {
                title: "Create Region",
                action: "CreateRegion"
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isCreated } = dialogResponse;
            if(isCreated) {
                this.populateRegions()
            }
        })
    }
    @ViewChild(MatTable) table: MatTable<any>
    editRegion(regionId: number, region: string) {
        this.dialog.open(RegionDialogComponent, {
            disableClose: true,
            data: {
                title: "Update Region",
                action: "UpdateRegion",
                regionId,
                region
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isUpdated, data } = dialogResponse
            let index = this.dataSource.data.findIndex((dt: any) => dt.id == data.id)
            this.dataSource.data[index] = data
            this.table.renderRows()
        })
    }

    deleteRegion(regionId: number) {
        this.dialog.open(RegionDialogComponent, {
            disableClose: true,
            data: {
                title: "Delete Region",
                question: "Are you sure you want to delete this region?",
                action: "DeleteRegion",
                regionId
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isDeleted } = dialogResponse;
            if(isDeleted) {
                this.populateRegions()
            }
        })
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.regionPerPage = pageData.pageSize
        this.populateRegions()
    }
}