import { Component, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { EarnService } from "../earn/earn.service";
import { EarnedPointsServices } from "../earned.points.service";
const CryptoJS = require("crypto-js");
@Component({
    selector: 'app-earned-points-dialog',
    templateUrl: './earned.points.dialog.component.html',
    styleUrls: ['./earned.points.dialog.component.scss']
})

export class EarnedPointsDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<EarnedPointsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private helperServices: HelperServices,
        private earnedPointsServices: EarnedPointsServices,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private earnServices: EarnService
    ) { }

    /** @States ===============================================================*/
    earnedPoints: any[] = []
    dataSource = new MatTableDataSource<IEarnedPointsDataSource>()
    readyToUpload: boolean = false;
    fileUploadForm: FormGroup = this.fb.group({
        earnedPoints: []
    })
    allErrors: any[] = []
    displayedColumns: string[] = [
        'errors',
        'row',
        'member_id',
        'transaction_no',
        'amount',
        'points_earn',
        'transaction_datetime',
        'actions',
    ]
    isValidatingEarnedPoints: boolean = false;
    btnValidate: "Validate Earned Points" | "Validating Earned Points" = "Validate Earned Points"
    earnedPointsExists: any[] = [];
    @ViewChild(MatPaginator) tblEarnedPointsPaginator: MatPaginator
    isValidated: boolean = false;
    isRemoving: boolean = false;
    btnUpload: "Upload Earned Points" | "Uploading Earned Points" = "Upload Earned Points";
    isUploadingEarnedPoints: boolean = false;
    /** @Methods ===============================================================*/
    fetchErrors() {
        return `${this.allErrors.join(", ")}, TOTAL ERRORS: ${this.allErrors.length}`
    }

    applyFilter(event: Event) {
        this.helperServices.filterTable(event, this.dataSource)
    }

    import() {
        this.dataSource.data = []
        this.readyToUpload = false;
        this.isValidated = false;
        this.allErrors = []
        const { earnedPoints } = this.fileUploadForm.value
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(earnedPoints)
        fileReader.onload = (event) => {
            const result: any = event.target?.result
            const resultObj = JSON.parse(result)
            var earnedPoints = CryptoJS.AES.decrypt(resultObj[0], 'secret key 123');
            var details = CryptoJS.AES.decrypt(resultObj[1], 'secret key 123');
            var originalEarnedPoints = JSON.parse(earnedPoints.toString(CryptoJS.enc.Utf8))
            var originalDetails = JSON.parse(details.toString(CryptoJS.enc.Utf8))
            originalEarnedPoints.forEach((earnPoint: IEarnedPointsDataSource, index: number) => {
                this.dataSource.data.push({
                    row: index + 1,
                    member_id: earnPoint.member_id,
                    transaction_no: earnPoint.transaction_no,
                    amount: earnPoint.amount,
                    points_earn: earnPoint.points_earn,
                    transaction_datetime: earnPoint.transaction_datetime,
                    error: []
                })
            })

        }
    }

    validateEarnedPoints() {
        this.btnValidate = "Validating Earned Points";
        this.isValidatingEarnedPoints = true;
        this.earnedPointsServices.validateEarnedPoints(this.dataSource.data).subscribe(res => {
            let earned_points_exist: any = [];
            this.isValidated = true;
            if (res.errors) {
                earned_points_exist = res.errors.earned_points_exist
                this.earnedPointsExists = earned_points_exist;
            }
            this.btnValidate = "Validate Earned Points";
            this.isValidatingEarnedPoints = false;
            if (earned_points_exist.length == 0) {
                this.readyToUpload = true;
            }
            this.allErrors = []
            if (earned_points_exist.length > 0) {
                this.dataSource.data.map(dt => dt.error = [])
                earned_points_exist.map((earnedPointsExist: IEarnedPointsExist) => {
                    this.dataSource.data.map((earnedPoints: IEarnedPointsDataSource) => {
                        if (earnedPointsExist.member_id == earnedPoints.member_id) {
                            this.allErrors.push(`# ${earnedPoints.row} was already imported`)
                            earnedPoints.error?.push("This earned points transaction was already imported")
                        }
                    })
                })
            }
        })
    }

    remove(row: number) {
        this.isRemoving = true;
        this.dataSource.data.splice(this.dataSource.data.findIndex((dt: IEarnedPointsDataSource) => dt.row == row), 1)
        this.dataSource.paginator = this.tblEarnedPointsPaginator
        this.earnedPointsServices.validateEarnedPoints(this.dataSource.data).subscribe(res => {
            this.isRemoving = false;
            let earned_points_exist: any[] = []
            if (res.errors) {
                earned_points_exist = res.errors.earned_points_exist
                this.earnedPointsExists = earned_points_exist;
            }
            this.btnValidate = "Validate Earned Points";
            this.isValidatingEarnedPoints = false;
            if (earned_points_exist.length == 0) {
                this.readyToUpload = true;
            }
            this.allErrors = []
            if (earned_points_exist.length > 0) {
                this.dataSource.data.map(dt => dt.error = [])
                earned_points_exist.map((earnedPointsExist: IEarnedPointsExist) => {
                    this.dataSource.data.map((earnedPoints: IEarnedPointsDataSource) => {
                        if (earnedPointsExist.member_id == earnedPoints.member_id) {
                            this.allErrors.push(`# ${earnedPoints.row} was already imported`)
                            earnedPoints.error?.push("This earned points transaction was already imported")
                        }
                    })
                })
            }
        })
    }

    upload() {
        this.dialog.open(EarnedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to upload this earned points?",
                action: "import-earned-points",
                earnedPoints: this.dataSource.data
            }
        }).afterClosed().subscribe(dialogRes => {
            const { isImported } = dialogRes
            if (isImported) this.dialogRef.close(dialogRes);
        })
    }

    uploadEarnedPoints() {
        this.btnUpload = "Uploading Earned Points";
        this.isUploadingEarnedPoints = true;
        this.earnedPointsServices.uploadEarnedPoints(this.data.earnedPoints).subscribe(res => {
            this.btnUpload = "Upload Earned Points";
            this.isUploadingEarnedPoints = false;
            this.dialogRef.close({
                isImported: true,
            })
        })
    }

    removeAllImportedEarnedPoinits() {
        let filteredData = this.dataSource.data.filter(dt => dt.error.length == 0)
        this.dataSource.data = filteredData
        this.dataSource.paginator = this.tblEarnedPointsPaginator;
        this.allErrors = []
        this.readyToUpload = true;
    }

    addingToClearedPoints: boolean = false;
    btnAddToClearedPoints: "Add" | "Adding" = "Add"
    addToClearedPoints() {
        const { selectedEarnedPoints } = this.data;
        this.addingToClearedPoints = true;
        this.btnAddToClearedPoints = "Adding";
        this.earnedPointsServices.addToClearedPoints({ data: selectedEarnedPoints }).subscribe(res => {
            const { message, code } = res;
            this.snackbar.open(message, "", {
                duration: 3000
            })
            this.addingToClearedPoints = false;
            this.btnAddToClearedPoints = "Add";
            this.dialogRef.close({ code })
        })
    }

    earn() {
        this.isEarning = true;
        this.earnServices.earnPoints(this.data.earnForm).subscribe(res => {
            const { message } = res;
            this.isEarning = false;
            this.snackbar.open(message, "", {
                duration: 3000
            })
            this.dialogRef.close({ isEarned: true })
        }, err => {
            const { error: { message } } = err;
            this.isEarning = false;
            this.snackbar.open(message, "", {
                duration: 3000
            })
            this.dialogRef.close({ isEarned: false })
        })
    }
    isEarning: boolean = false;
    cancel() {
        this.dialogRef.close({ isEarned: false })
    }

    voidString: string = "";
    isVoiding: boolean = false;
    validateVoid() {
        let result = this.data.randomText.localeCompare(this.voidString)
        if(result != 0) {
            return true
        }
        return false;
    }
    void() {
        this.isVoiding = true;
        this.earnedPointsServices.void(this.data.earnedPoint).subscribe(res => {
            this.isVoiding = false;
            const { body: { id, message } } = res;
            this.dialogRef.close({
                id
            })
            this.snackbar.open(message, "", { duration: 3000 })
        }, err => {
            const { error: { message } } = err;
            this.isVoiding = false;
            this.snackbar.open(message, "", { duration: 3000 })
        })
    }
}

interface IEarnedPointsDataSource {
    row: number;
    member_id: number;
    transaction_no: string;
    amount: number;
    points_earn: number;
    transaction_datetime: string;
    error: any[]
}

interface IEarnedPointsExist {
    member_id: number;
    transaction_datetime: string;
}