import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { concat } from "rxjs";
import { ClearedPointsServices } from "../cleared.points.service";
const XLSX = require("xlsx");
const _ = require("lodash");
@Component({
    selector: 'app-cleared-points-dialog',
    templateUrl: './cleared.points.dialog.component.html',
    styleUrls: ['./cleared.points.dialog.component.scss']
})

export class ClearedPointsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ClearedPointsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private clearedPointsServices: ClearedPointsServices,
        private fb: FormBuilder
    ) { }

    displayedColumns: string[] = [
        "date",
        "transaction_id",
        "store",
        "earned_points",
        "redeemed_points",
        "cleared_points"
    ]

    dataSource = new MatTableDataSource<any>(this.data.history)
    pageSizeOption: number[] = [5, 10, 15, 20];
    itemsPerPage: number = 5;
    currentPage: number = 1;
    totalHistory: number = 0;
    lblLoading: "Loading..." | "No Data" = "Loading..."
    currentClearedPoints: number = 0;
    ngOnInit(): void {
        if (this.data.action == 'soa') this.populateHistory()
    }

    populateHistory() {
        this.clearedPointsServices.viewSoa(this.data.memberId, this.currentPage, this.itemsPerPage).subscribe(res => {
            console.log(res)
            const { status, body: { soa, currentclearedpoints } } = res;
            if (status == 200) {
                if (soa.length == 0) this.lblLoading = "No Data"
                this.dataSource.data = soa
                this.currentClearedPoints = currentclearedpoints
                // this.totalHistory = total;
            }
        })
    }

    onChangePage(pageData: PageEvent) {
        this.dataSource.data = []
        this.currentPage = pageData.pageIndex + 1;
        this.itemsPerPage = pageData.pageSize
        this.populateHistory()
    }

    excelData: any[] = [];
    importedPercentage: number = 0;
    buttonImport: "Import" | "Initializing..." | "Importing..." | "Waiting To Server" | "Done" = "Import";
    buttonCancel: "Cancel" | "Close" = "Cancel"
    isConvertingToJson: boolean = false;
    currentUploading: number = 0;
    totalClearedPoints: number = 0;
    insertedClearedPoints: number = 0;
    updatedClearedPoints: number = 0;
    failedToImported: any[] = [];
    fileUploadForm: FormGroup = this.fb.group({
        clearedPointsExcelFile: []
    })

    import() {
        this.isConvertingToJson = true
        this.buttonImport = "Initializing..."
        setTimeout(() => {
            const { clearedPointsExcelFile } = this.fileUploadForm.value
            const fileReader = new FileReader()
            fileReader.readAsBinaryString(clearedPointsExcelFile)
            fileReader.onload = async (event) => {
                let binaryData = event.target?.result;
                let workbook = XLSX.read(binaryData, { type: "binary", password: "1234" })
                this.excelData = workbook.SheetNames.map((sheet: any) => {
                    return {
                        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                    }
                })[0].data
                this.buttonImport = "Importing..."
                this.totalClearedPoints = this.excelData.length;
                const chunk = _.chunk(this.excelData, 1000)

                concat(
                    ...chunk.map((clearedPoint: any) => this.clearedPointsServices.importClearedPoints(clearedPoint))
                ).subscribe((event: HttpEvent<any> | any) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            break;
                        case HttpEventType.Response:
                            const { insertedClearedPoints, notinsertedClearedPoints, updatedClearedPoints } = event.body;
                            this.insertedClearedPoints = insertedClearedPoints.length
                            this.updatedClearedPoints = updatedClearedPoints.length
                            this.failedToImported = this.failedToImported.concat(notinsertedClearedPoints)
                            this.currentUploading = this.currentUploading + this.insertedClearedPoints + notinsertedClearedPoints.length + this.updatedClearedPoints;
                            this.importedPercentage = this.currentUploading / this.totalClearedPoints * 100
                    }
                }, err => { }, () => {
                    this.buttonCancel = "Close";
                    this.buttonImport = "Done"
                })
            }
        }, 1000);
    }

    cancel() {
        if (this.buttonCancel == "Close") {
            this.dialogRef.close({
                isUploaded: true
            })
        }

        if (this.buttonCancel == "Cancel") {
            this.dialogRef.close({
                isUploaded: false
            })
        }
    }
}