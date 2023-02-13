import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsServices } from "../reports.service";

@Component({
  selector: 'app-reports-redeemed-points',
  templateUrl: './reports.redeemed.points.component.html',
  styleUrls: ['./reports.redeemed.points.component.scss']
})

export class ReportsRedeemedPointsComponent {

  constructor(
    public helperServices: HelperServices,
    public reportsServices: ReportsServices,
    private snackbar: MatSnackBar
  ) { }

  title: string = "Redeemed Points"
  // dataSource = new MatTableDataSource<IRedeemedPoints>(RedeemedPointsDummyData)
  displayedColumns: string[] = [
    "id",
    "mobileNumber",
    "firstName",
    "lastName",
    "store",
    "pointsRedeemed",
    "transaction_no",
    "dateRedeemed",
    "isVoided",
    "voidedAt"
  ]
  searchValue: string = "";
  @ViewChild("earnedPointsPaginator") paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.reportsServices.redeemedPointsReportDataSource.paginator = this.paginator
  }

  exportToExcel() {
    const dataForExcel: any = []
    this.reportsServices.redeemedPointsReportDataSource.filteredData.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })
    let reportData = {
      title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
      data: dataForExcel,
      headers: ["ID", "Mobile Number", "First Name", "Last Name", "Store", "Redeemed Points", "Transaction_no",  "Redeemed Date", "Void Status", "Date Voided"],
      columnColorNumber: 8,
      titleMergeCell: {
        from: 'A1',
        to: 'J2'
      }
    }
    this.helperServices.exportExcel(reportData)
  }

  copyToClipboard() {
    this.snackbar.open("Redeemed Points copied to clipboard", "", { duration: 3000 })
  }

  stringtifyDataSource() {
    return JSON.stringify(this.reportsServices.redeemedPointsReportDataSource.filteredData)
  }

  exportToCSV() {
    const dataForExcel: any = []
    this.reportsServices.redeemedPointsReportDataSource.filteredData.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })
    let reportData = {
      title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
      data: dataForExcel,
      headers: ["ID", "Mobile Number", "First Name", "Last Name", "Store", "Redeemed Points", "Transaction_no", "Redeemed Date", "Void Status", "Date Voided"],
      titleMergeCell: {
        from: 'A1',
        to: 'J2'
      }
    }
    this.helperServices.exportCSV(reportData)
  }

  validateActions() {
    if(this.reportsServices.redeemedPointsReportDataSource.filteredData.length == 0) return true;
    return false
  }

  applyFilter(event: Event) {
    this.helperServices.filterTable(event, this.reportsServices.redeemedPointsReportDataSource)
  }
}
