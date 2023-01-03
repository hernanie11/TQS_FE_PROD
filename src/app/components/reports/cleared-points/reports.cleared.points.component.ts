import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsServices } from "../reports.service";

@Component({
    selector: 'app-reports-cleared-points',
    templateUrl: './reports.cleared.points.component.html',
    styleUrls: ['./reports.cleared.points.component.scss']
})

export class ReportClearedPointsComponent {

    constructor(
        private helperServices: HelperServices,
        public reportsServices: ReportsServices,
        private snackbar: MatSnackBar
    ) { }

    title: string = "Cleared Points";
    // dataSource = new MatTableDataSource<IClearedPoints>(ClearedPointsDummy)
    displayedColumns: string[] = [
        'id',
        'firstName',
        'lastName',
        'clearedPoints',
    ];
    @ViewChild("earnedPointsPaginator") paginator: MatPaginator;
    ngAfterViewInit(): void {
        this.reportsServices.clearedPointsReportDataSource.paginator = this.paginator
    }

    copyToClipboard() {
        this.snackbar.open("Earned Points copied to clipboard", "", { duration: 3000 })
    }

    stringtifyDataSource() {
        return JSON.stringify(this.reportsServices.clearedPointsReportDataSource.filteredData)
    }

    exportToExcel() {
        const dataForExcel: any = []
        this.reportsServices.clearedPointsReportDataSource.filteredData.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
        })
        let reportData = {
            title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
            data: dataForExcel,
            headers: ["ID", "First Name", "Last Name", "Cleared Points"],
            columnColorNumber: 8,
            titleMergeCell: {
                from: 'A1',
                to: 'D2'
            }
        }
        this.helperServices.exportExcel(reportData)
    }

    exportToCSV() {
        const dataForExcel: any = []
        this.reportsServices.clearedPointsReportDataSource.filteredData.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
        })
        let reportData = {
            title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
            data: dataForExcel,
            headers: ["ID", "First Name", "Last Name", "Cleared Points"],
            columnColorNumber: 8,
            titleMergeCell: {
                from: 'A1',
                to: 'D2'
            }
        }
        this.helperServices.exportCSV(reportData)
    }

    applyFilter(event: Event) {
        this.helperServices.filterTable(event, this.reportsServices.clearedPointsReportDataSource)
    }

    validateActions() {
        if (this.reportsServices.clearedPointsReportDataSource.filteredData.length == 0) return true;
        return false
    }

}

const ClearedPointsDummy: IClearedPoints[] = [
    {
        id: 1,
        firstName: "Liezl",
        lastName: "Mendoza",
        clearedPoints: 12
    },
    {
        id: 2,
        firstName: "Philip Joshua",
        lastName: "Mendoza",
        clearedPoints: 12
    },
    {
        id: 3,
        firstName: "Philip Joshua",
        lastName: "Mendoza",
        clearedPoints: 12
    },
    {
        id: 4,
        firstName: "Philip Joshua",
        lastName: "Mendoza",
        clearedPoints: 12
    },
    {
        id: 5,
        firstName: "Philip Joshua",
        lastName: "Mendoza",
        clearedPoints: 12
    }
]

interface IClearedPoints {
    id: number;
    firstName: string;
    lastName: string;
    clearedPoints: number
}