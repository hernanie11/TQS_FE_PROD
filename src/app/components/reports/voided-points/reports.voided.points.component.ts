import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsServices } from "../reports.service";

@Component({
    selector: 'app-voided-points',
    templateUrl: './reports.voided.points.component.html',
    styleUrls: ['./reports.voided.points.component.scss']
})

export class ReportVoidedPointsComponent {
    constructor(
        public reportsServices: ReportsServices,
        private helperServices: HelperServices,
        private snackbar: MatSnackBar
    ) { }

    searchValue: string = "";
    displayedColumns: string[] = [
        "id",
        "storeName",
        "date_earned",
        "transactionNo",
        "mobileNumber",
        "firstName",
        "lastName",
        "amount",
        "points_earn",
        "date_voided",
        "date_synched",
    ];
    title: string = "Voided Points";
    @ViewChild("voidedPointsPaginator") voidedPointsPaginator: MatPaginator

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.reportsServices.voidedPointsReportDataSource.paginator = this.voidedPointsPaginator
    }

    validateActions() {
        if (this.reportsServices.voidedPointsReportDataSource.filteredData.length == 0) return true;
        return false
    };


    exportToExcel() {
        const dataForExcel: any = []
        this.reportsServices.voidedPointsReportDataSource.filteredData.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
        })
        let reportData = {
            title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
            data: dataForExcel,
            headers: ["ID", "Store", "Transaction Date", "Transaction No.", "Mobile Number", "First Name", "Last Name", "Amount", "Voided Points", "Date Voided", "Date Synched / Uploaded"],
            columnColorNumber: 8,
            titleMergeCell: {
                from: 'A1',
                to: 'K2'
            }
        }
        console.log(reportData)
        this.helperServices.exportExcel(reportData)
    };

    exportToCSV() {
        const dataForExcel: any = []
        this.reportsServices.voidedPointsReportDataSource.filteredData.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
        })
        let reportData = {
            title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
            data: dataForExcel,
            headers: ["ID", "Store", "Transaction Date", "Transaction No.", "Mobile Number", "First Name", "Last Name", "Amount", "Voided Points", "Date Voided", "Date Synched / Uploaded"],
            titleMergeCell: {
                from: 'A1',
                to: 'K2'
            }
        }
        this.helperServices.exportCSV(reportData)
    };


    copyToClipboard() {
        this.snackbar.open("Earned Points copied to clipboard", "", { duration: 3000 })
    };


    applyFilter(event: Event) {
        this.helperServices.filterTable(event, this.reportsServices.voidedPointsReportDataSource)
    };

    stringtifyDataSource() {
        return JSON.stringify(this.reportsServices.voidedPointsReportDataSource.filteredData)
    };
};