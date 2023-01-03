import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsServices } from "../reports.service";

@Component({
  selector: 'app-reports-earned-points',
  templateUrl: './reports.earned.points.component.html',
  styleUrls: ['./reports.earned.points.component.scss']
})

export class ReportsEarnedPointsComponent {

  constructor(
    private helperServices: HelperServices,
    public reportsServices: ReportsServices,
    private snackbar: MatSnackBar
  ) {}

  displayedColumns: string[] = [
    'id', 
    'storeName', 
    'receiptNumber', 
    'category', 
    'firstName', 
    'lastName',
    'mobileNumber',
    'amount',
    'earnedPoints',
    'status',
    'dateEarned',
    'dateSynched',
    'dateCleared',
    'isVoided',
    'voidedAt'
  ];

  searchValue: string = "";
  // dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  
  title: string = "Earned Points";

  @ViewChild("earnedPointsPaginator") paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.reportsServices.earnedPointsReportDataSource.paginator = this.paginator
  }

  copyToClipboard() {
    this.snackbar.open("Earned Points copied to clipboard", "", { duration: 3000 })
  }

  stringtifyDataSource() {
    return JSON.stringify(this.reportsServices.earnedPointsReportDataSource.filteredData)
  }

  exportToExcel() {
    const dataForExcel: any = []
    this.reportsServices.earnedPointsReportDataSource.filteredData.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })
    let reportData = {
      title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
      data: dataForExcel,
      headers: ["ID", "Store", "Receipt Number", "Category","First Name", "Last Name", "Mobile Number", "Amount", "Earned Points", "Status", "Date Earned", "Date Synched", "Date Cleared", "Void Status", "Date Voided"],
      columnColorNumber: 9,
      titleMergeCell: {
        from: 'A1',
        to: 'O2'
      }
    }
    this.helperServices.exportExcel(reportData)
  }

  exportToCSV() {
    const dataForExcel: any = []
    this.reportsServices.earnedPointsReportDataSource.filteredData.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })
    let reportData = {
      title: `(${this.reportsServices.selectedReport}) - (${this.reportsServices.selectedBasedDateRange}) - (From: ${new Date(this.reportsServices.selectedDateRange.start).toLocaleDateString()} - To: ${new Date(this.reportsServices.selectedDateRange.end).toLocaleDateString()})`,
      data: dataForExcel,
      headers: ["ID", "Store", "Receipt Number", "Category","First Name", "Last Name", "Mobile Number", "Amount", "Earned Points", "Status", "Date Earned", "Date Synched", "Date Cleared", "Void Status", "Date Voided"],
      columnColorNumber: 9,
      titleMergeCell: {
        from: 'A1',
        to: 'O2'
      }
    }
    this.helperServices.exportCSV(reportData)
  }

  applyFilter(event: Event) {
    this.helperServices.filterTable(event, this.reportsServices.earnedPointsReportDataSource)
  }

  validateActions() {
    if(this.reportsServices.earnedPointsReportDataSource.filteredData.length == 0) return true;
    return false
  }
}


export interface EarnedPointsReport {
  id: number;
  receiptNumber: string;
  category: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  amount: number;
  earnedPoints: number;
  status: string;
  dateEarned: string;
  dateSynched: string;
  dateCleared: string;
  
}

const ELEMENT_DATA: EarnedPointsReport[] = [
  {
    id: 1,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Liezl",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 2,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 3,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 4,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 5,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 6,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 7,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 8,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
  {
    id: 9,
    receiptNumber: "QASD!@#",
    category: "Synched",
    firstName: "Philip Joshua",
    lastName: "Mendoza",
    mobileNumber: "09673118434",
    amount: 1000,
    earnedPoints: 10,
    status: "Cleared",
    dateEarned: "January 15, 2022 9:30am",
    dateSynched: "January 15, 2022 8:00pm",
    dateCleared: "January 19, 2022 9:00am"
  },
];