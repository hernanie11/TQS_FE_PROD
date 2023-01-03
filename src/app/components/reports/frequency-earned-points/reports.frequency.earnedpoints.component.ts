import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsServices } from "../reports.service";

@Component({
    selector: 'app-frequency-earnedpoints',
    templateUrl: './reports.frequency.earnedpoints.component.html',
    styleUrls: ['./reports.frequency.earnedpoints.component.scss']
})

export class ReportFrequencyEarnedPointsComponent {
    constructor(
        public reportsServices: ReportsServices,
        private helperServices: HelperServices,
        private snackbar: MatSnackBar
    ) { }

    searchValue: string = "";
    displayedColumns: string[] = [
        "mobileNumber",
        "firstName",
        "lastName",
        "frequency",
    ];
    title: string = "Frequency Earned Points";
    @ViewChild("frequencyEarnedPointsPaginator") frequencyEarnedPointsPaginator: MatPaginator

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.reportsServices.frequencyEarnedPointsReportDataSource.paginator = this.frequencyEarnedPointsPaginator
    }

    validateActions() {
        if (this.reportsServices.frequencyEarnedPointsReportDataSource.filteredData.length == 0) return true;
        return false
    };


    exportToExcel() {
        const dataForExcel: any = []
        this.reportsServices.frequencyEarnedPointsReportDataSource.filteredData.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
        })
        let reportData = {
            title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
            data: dataForExcel,
            headers: ["Mobile Number", "First Name", "Last Name", "Frequency"],
            columnColorNumber: 8,
            titleMergeCell: {
                from: 'A1',
                to: 'D2'
            }
        }
        console.log(reportData)
        this.helperServices.exportExcel(reportData)
    };

    exportToCSV() {
        const dataForExcel: any = []
        this.reportsServices.frequencyEarnedPointsReportDataSource.filteredData.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
        })
        let reportData = {
            title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
            data: dataForExcel,
            headers: ["Mobile Number", "First Name", "Last Name", "Frequency"],
            titleMergeCell: {
                from: 'A1',
                to: 'D2'
            }
        }
        this.helperServices.exportCSV(reportData)
    };


    copyToClipboard() {
        this.snackbar.open("Earned Points copied to clipboard", "", { duration: 3000 })
    };


    applyFilter(event: Event) {
        this.helperServices.filterTable(event, this.reportsServices.frequencyEarnedPointsReportDataSource)
    };

    stringtifyDataSource() {
        return JSON.stringify(this.reportsServices.frequencyEarnedPointsReportDataSource.filteredData)
    };
};