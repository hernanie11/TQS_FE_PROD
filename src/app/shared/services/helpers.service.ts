import { Injectable } from "@angular/core";
import exportFromJSON from 'export-from-json'
const CryptoJS = require("crypto-js");
import { Workbook } from 'exceljs';
import { TextError } from "src/app/interfaces/errors";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CredServices } from "./cred.service";
import { SidebarServices } from "../layouts/sidebar/sidebar.service";
import { generate } from "rxjs";
import { updateLocale } from "moment";
const fs = require("file-saver")
@Injectable({
  providedIn: "root"
})

export class HelperServices {

  constructor(
    private snackbar: MatSnackBar,
    private credServices: CredServices,
    private sidebarServices: SidebarServices
  ) {}
  hasInternet: boolean;
  today = new Date()

  filterTable(event: Event, dataSource: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportJsonData(data: any, fileName: string, exportType: any = 'json') {
    const bytes = CryptoJS.AES.decrypt(data[0], 'secret key 123');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.table(JSON.parse(originalText))
    exportFromJSON({ data, fileName, exportType })
  }

  exportExcel(excelData: any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const columnColorNumber = excelData.columnColorNumber
    const titleMergeCell = {
      from: excelData.titleMergeCell.from,
      to: excelData.titleMergeCell.to
    }

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');

    //Add Row and formatting
    worksheet.mergeCells(titleMergeCell.from, titleMergeCell.to);
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '303030' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    // worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.toLocaleDateString()


    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '303030' },
        bgColor: { argb: '  ' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      worksheet.addRow(d);
    });

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  exportCSV(excelData: any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const columnColorNumber = excelData.columnColorNumber
    const titleMergeCell = {
      from: excelData.titleMergeCell.from,
      to: excelData.titleMergeCell.to
    }

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');

    //Add Row and formatting
    worksheet.mergeCells(titleMergeCell.from, titleMergeCell.to);
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '303030' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    // worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.toLocaleDateString()


    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '303030' },
        bgColor: { argb: '  ' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      worksheet.addRow(d);
    });

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.csv');
    })

  }

  decryptDb(encryptedDb: any) {
    const bytes  = CryptoJS.AES.decrypt(encryptedDb, 'secret key 123');
    const originalDb = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalDb);
  }

  isOk(httpResponse: any) {
    if(httpResponse.status != 200) {
      return false
    }
    return true;

  }

  catchError(err: any, hasDuration: boolean, duration?: number, customMessage?: string) {
    let error: TextError  | "" = ""
    if(err.status == 500) {
      error = "Something went wrong";
    }
    if(err.status == 400) {
      if(err.error.message == "User Not Found!!") {
        error = "No Data Found"
      }
    }
    if(err.status == 401) {
      error = "Unauthorized"
      this.snackbar.open(error, customMessage, { duration })
    }
    if(err.status == 429) {
      error = "Too many requests";
    }
    if(err.status == 422) {
      error = "Unprocessable Content"
    }
    if(err.name == "TimeoutError") {
      error = "Server cannot be reach. Please Try Again Later";
    }
    if(err.statusText == "Unknown Error") {
      error = "Something went wrong";
    }
    if(hasDuration) {
      if(err.status == 422) {
        this.snackbar.open(error, customMessage, { duration })
      }
      else {
        this.snackbar.open(error, "", { duration })
      }
      
    }
    if(!hasDuration) {
      this.snackbar.open(error, "")
    }
    return error;
  }

  refreshAccessModules() {
    this.sidebarServices.dataSource.data = []
    let { user: { access_permission } } = this.credServices.getCredentials()
    let masterlist_childrens: any = []
    let transaction_childrens: any = []
    let file_childrens: any = []
    let report: any []
    access_permission.map((access: string) => {
      if (access == "user-accounts") masterlist_childrens.push({ name: "User Accounts" })
      if (access == "stores") {
        masterlist_childrens.push({ name: "Store Codes" })
        masterlist_childrens.push({ name: "Areas" })
        masterlist_childrens.push({ name: "Regions" })
        masterlist_childrens.push({ name: "Clusters" })
        masterlist_childrens.push({ name: "Business Model" })
        masterlist_childrens.push({ name: "Stores" })
      }
      if (access == "members") masterlist_childrens.push({ name: "Members" })
      if (access == "earned-points") transaction_childrens.push({ name: "Earned Points" })
      if (access == "redeemed-points") transaction_childrens.push({ name: "Redeemed Points" })
      if (access == "cleared-points") transaction_childrens.push({ name: "Cleared Points" })
      if (access == "generate-file") file_childrens.push({ name: "Generate File"})
      if (access == "update-file") file_childrens.push({ name: "Update File"})
      // if(access = "reports") report.push({name: "Reports"})
    })
    this.sidebarServices.Modules.map((module: any) => {
      if (module.name == "Master list") module.childrens = masterlist_childrens
      if (module.name == "Transactions") module.childrens = transaction_childrens
      if (module.name == "Generate File / Update File") module.childrens = file_childrens
      // if(module.name == "Reports") module = report
    })
    this.sidebarServices.dataSource.data = this.sidebarServices.Modules
  }

  hasAccess(access: string) {
    const { access_permission } = this.credServices.getCredentials().client_user
    let canAccess = access_permission.some((acc: string) => acc == access)
    return canAccess;
  }

}