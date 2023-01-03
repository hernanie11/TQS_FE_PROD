import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { MembersServices } from "../members.service";
import * as XLSX from 'xlsx';
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MembersRegisterServices } from "../register/members.register.service";
import { concat, from, interval, of } from "rxjs";
import { concatMap, delay, takeWhile } from "rxjs/operators";
import { HttpEvent, HttpEventType } from '@angular/common/http';
const _ = require("lodash");
@Component({
    selector: 'app-members-dialog',
    templateUrl: './members.dialog.component.html',
    styleUrls: ['./members.dialog.component.scss']
})

export class MembersDialogComponent {

    constructor(
        private dialogRef: MatDialogRef<MembersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private membersServices: MembersServices,
        private router: Router,
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private helpersServices: HelperServices,
        private dialog: MatDialog,
        private membersRegisterService: MembersRegisterServices,
        private helperServices: HelperServices
    ) { }

    /** @States ========================================================== */
    isButtonLoading: boolean = false;
    fileUploadForm: FormGroup | any = this.fb.group({
        memberExcelFile: [null]
    })
    excelData: any[] = []
    @ViewChild("tblMembers") tblMembers: MatTable<any>
    @ViewChild(MatPaginator) tblMembersPaginator: MatPaginator
    displayedColumns = [
        'errors',
        'row',
        'first_name',
        'last_name',
        'gender',
        'birthday',
        'barangay',
        'municipality',
        'province',
        'email',
        'mobile_number',
        'actions',
    ];
    dataSource = new MatTableDataSource<IMemberDataSource>();
    allErrors: any[] = [];
    isEditAll: boolean = false;
    btnImport: string = "Import";
    readyToUpload: boolean = false;
    isValidating: boolean = false;
    btnValidate: "Validate Mobile Numbers" | "Validating Mobile Numbers" = "Validate Mobile Numbers";
    validateQuery: boolean = false;


    /** @Methods ============================================================ */
    create() {
        this.isButtonLoading = true;
        this.data.button_name = "Creating";
        const { memberForm } = this.data;
        this.membersServices.createMember(memberForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Create";
            const { status, body: { data, message } } = res
            if (status == 201) {
                this.snackBar.open(message, "", { duration: 3000 })
                this.dialogRef.close();
                this.router.navigate(["/admin/members"])
            }
        }, err => {
            this.isButtonLoading = false;
            this.data.button_name = "Create";
            this.helpersServices.catchError(err, true, 3000, err.error.errors.mobile_number[0])
        })
    }

    update() {
        this.isButtonLoading = true;
        this.data.button_name = "Updating";
        const { memberId, memberForm } = this.data;
        this.membersServices.updateMemberbyId(memberId, memberForm).subscribe(res => {
            this.isButtonLoading = false;
            this.data.button_name = "Update";
            const { status, body: { message } } = res;
            if (status == 200) {
                this.snackBar.open(message, "", { duration: 3000 })
                this.dialogRef.close()
                this.router.navigate(["/admin/members"])
            }
        }, err => {
            this.isButtonLoading = false;
            this.data.button_name = "Update";
            this.helpersServices.catchError(err, true, 3000)
        })
    }

    ActivateInActive() {
        this.isButtonLoading = true;
        if (this.data.button_name == "Deactivate") {
            this.data.button_name = "Deactivating";
            const { member: { id } } = this.data;
            if (this.data.button_name == "Deactivating") {
                this.membersServices.updateStatusById(id, false).subscribe(res => {
                    this.isButtonLoading = false;
                    this.data.button_name = "Deactivate";
                    const { status, body: { message } } = res;
                    if (status == 200) {
                        this.snackBar.open(message, "", { duration: 3000 })
                        this.dialogRef.close({
                            memberId: id,
                            status: "Inactive",
                        })
                    }
                }, err => {
                    this.data.button_name = "Deactivate";
                    this.isButtonLoading = false;
                    this.helpersServices.catchError(err, true, 3000)
                })
            }
        }
        if (this.data.button_name == "Activate") {
            this.data.button_name = "Activating";
            const { member: { id } } = this.data;
            this.membersServices.updateStatusById(id, true).subscribe(res => {
                this.data.button_name = "Activate";
                const { status, body: { message } } = res;
                if (status == 200) {
                    this.snackBar.open(message, "", { duration: 3000 })
                    this.dialogRef.close({
                        memberId: id,
                        status: "Active",
                    })
                }
            }, err => {
                this.data.button_name = "Activate";
                this.isButtonLoading = false;
                this.helpersServices.catchError(err, true, 3000)
            })
        }
    }

    discard() {
        this.router.navigate(["/admin/members"])
        this.dialogRef.close()
    }

    fetchErrors() {
        return `${this.allErrors.join(", ")}, TOTAL ERRORS: ${this.allErrors.length}`
    }

    importedPercentage: number = 0;
    importedCount: number = 0
    failedToImported: any[] = [];
    isConvertingToJson: boolean = false;
    buttonImport: "Import" | "Initializing..." | "Importing..." | "Waiting To Server" |  "Done" = "Import";
    // progress: number = 0;
    buttonCancel: "Cancel" | "Close"= "Cancel"
    totalMembers: number = 0;
    currentUploading: number = 0;
    insertedMembers: number = 0;
    uploadingSeconds: number = 0;
    counter = interval(1000).pipe(takeWhile(() => this.importedPercentage != 100))
    count: number = 0;
    import() {
        // this.excelData = []
        this.isConvertingToJson = true
        this.buttonImport = "Initializing..."
      
        setTimeout(() => {
            this.allErrors = [];
            this.dataSource.data = [];
            this.readyToUpload = false;
            const { memberExcelFile } = this.fileUploadForm.value
            const fileReader = new FileReader()
            fileReader.readAsBinaryString(memberExcelFile)
            fileReader.onload = async (event) => {
                let binaryData = event.target?.result;
                let workbook = XLSX.read(binaryData, { type: "binary", password: "1234" })

                this.excelData = workbook.SheetNames.map(sheet => {
                    const members = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                    return {
                        data: Array.from(new Set(members.map((member: any) => member.mobile_number)))
                        .map((mobile_number: any) => {
                            return members.find((a: any) => a.mobile_number == mobile_number)
                        }).filter((d: any) => d.mobile_number != undefined)
                    }
                })[0].data

                this.buttonImport = "Importing..."
                const chunk = _.chunk(this.excelData, 1000)
                this.totalMembers = this.excelData.length;   
                concat(
                    ...chunk.map((member: any) => this.membersServices.importMembers(member))
                ).subscribe((event: HttpEvent<any> | any) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            break;
                        case HttpEventType.Response:
                            const { notInsertedMembers, insertedMembers } = event.body;
                            this.insertedMembers = insertedMembers.length
                            this.failedToImported = this.failedToImported.concat(notInsertedMembers)
                            this.currentUploading = this.currentUploading + this.insertedMembers + notInsertedMembers.length;
                            this.importedPercentage = this.currentUploading / this.totalMembers * 100
                    }
                }, err => {
                }, () => {
                    this.buttonCancel = "Close";
                    this.buttonImport = "Done"
                })
            }
        }, 1000);
    }
    close() {
        this.dialogRef.close({reloadData: true})
    }

    cancel() {
        if(this.buttonCancel == "Close") {
            this.dialogRef.close(false)
        }

        if(this.buttonCancel == "Cancel") {
            this.dialogRef.close(true)
        }
    }

    createMemberForUploading(member: any) {
        this.membersServices.createMember(member).subscribe(res => {
            this.importedCount++;
            this.importedPercentage = this.importedCount / this.excelData.length * 100
            this.isImportingDone()
        }, err => {
            this.importedCount++;
            this.importedPercentage = this.importedCount / this.excelData.length * 100
            this.isImportingDone()
            this.failedToImported.push({
                member,
                err
            })
        })
    }

    isImportingDone() {
        if (this.importedPercentage == 100) {
            this.buttonImport = "Import"
            this.isConvertingToJson = false;
        }
    }

    applyFilter(event: Event) {
        this.helpersServices.filterTable(event, this.dataSource)
    }

    edit(rowNumber: number) {
        let index = this.dataSource.data.findIndex((member: IMemberDataSource) => member.row == rowNumber)
        this.dataSource.data[index].isEdit = true;
    }

    allFieldAreFillUp() {
        let yeah = this.dataSource.data.some((member: IMemberDataSource) => member.first_name.trim() == "" || member.last_name.trim() == "" || member.gender.trim() == "" || member.birthday == "" || member.barangay.trim() == "" || member.municipality.trim() == "" || member.province.trim() == "" || member.email.trim() == "" || member.mobile_number.trim() == "")
        return yeah
    }

    ok(rowNumber: number) {
        let index = this.dataSource.data.findIndex((member: IMemberDataSource) => member.row == rowNumber)
        this.dataSource.data[index].isEdit = false;
        this.allErrors = [];


        this.dataSource.data.map((member: IMemberDataSource, index: number) => {
            let errors: string[] = [];

            if (member.first_name == undefined || member.first_name == "") {
                this.allErrors.push(`No First Name # ${index + 1}`)
                errors.push("First Name is required")
            }

            if (member.last_name == undefined || member.last_name == "") {
                this.allErrors.push(`No Last Name # ${index + 1}`)
                errors.push("Last Name is required")
            }

            if (member.gender == undefined || member.gender == "") {
                this.allErrors.push(`No Gender # ${index + 1}`)
                errors.push("Gender is required")
            }

            if (member.birthday == undefined || member.birthday == "") {
                this.allErrors.push(`No Birthday # ${index + 1}`)
                errors.push("Birthday is required")
            }

            if (member.barangay == undefined || member.barangay == "") {
                this.allErrors.push(`No Barangay # ${index + 1}`)
                errors.push("Barangay is required")
            }

            if (member.municipality == undefined || member.municipality == "") {
                this.allErrors.push(`No Municipality # ${index + 1}`)
                errors.push("Municipality is required")
            }

            if (member.province == undefined || member.province == "") {
                this.allErrors.push(`No Province # ${index + 1}`)
                errors.push("Province is required")
            }

            if (member.email == undefined || member.email == "") {
                this.allErrors.push(`No Email # ${index + 1}`)
                errors.push("Email is required")
            }

            if (member.mobile_number == undefined || member.mobile_number == "") {
                this.allErrors.push(`No Mobile Number # ${index + 1}`)
                errors.push("Mobile number is required")
            }
            if (member.mobile_number) {
                if (member.mobile_number.length != 11) {
                    this.allErrors.push(`Mobile Number is not 11 digits # ${index + 1}`)
                    errors.push(`Mobile number is only ${member.mobile_number.length} digits`)
                }
            }
            this.dataSource.data[index].error = errors;
        })
        let { duplicateMobileNumbers } = this.checkDuplicateMobileNumbers();
        if (duplicateMobileNumbers.length > 0) {
            duplicateMobileNumbers.map(duplicateMobileNumber => this.allErrors.push(`Duplicate Mobile Numbers at row ${duplicateMobileNumber.row}`))
        }

        if (this.validateQuery) {
            this.membersServices.validateMembers(this.dataSource.data).subscribe(res => {
                const { memberExists } = res;
                if (memberExists.length == 0) {
                    this.readyToUpload = true
                    this.snackBar.open("All Mobile Numbers are not yet registered. Upload Members to proceed", "", { duration: 3000 })
                }
                if (memberExists.length > 0) {
                    this.readyToUpload = false;
                    memberExists.map((mobileNumber: any) => {
                        this.dataSource.data.map((member: IMemberDataSource) => {
                            if (member.mobile_number == mobileNumber.mobile_number) {
                                this.allErrors.push(`Mobile Number at row ${member.row} is already exists`)
                                member.error?.push(`Mobile number is already exists`)
                            }
                        })
                    })
                }
            })
        }


    }

    editAll() {
        this.isEditAll = !this.isEditAll;
        if (this.isEditAll) {
            this.dataSource.data.map((member: IMemberDataSource) => member.isEdit = true)
        }
        if (!this.isEditAll) {
            this.dataSource.data.map((member: IMemberDataSource) => member.isEdit = false)
        }

    }

    remove(rowNumber: number) {
        this.dataSource.data.splice(this.dataSource.data.findIndex((member: IMemberDataSource) => member.row == rowNumber), 1)
        this.dataSource.paginator = this.tblMembersPaginator
        this.allErrors = []
        this.dataSource.data.map(dt => dt.error = [])
        this.dataSource.data.map((member: IMemberDataSource, index: number) => {
            if (member.first_name == undefined || member.first_name == "") {
                this.allErrors.push(`No First Name # ${member.row}`)
                member.error.push("First Name is required")
            }

            if (member.last_name == undefined || member.last_name == "") {
                this.allErrors.push(`No Last Name # ${member.row}`)
                member.error.push("Last Name is required")
            }

            if (member.gender == undefined || member.gender == "") {
                this.allErrors.push(`No Gender # ${member.row}`)
                member.error.push("Gender is required")
            }

            if (member.birthday == undefined || member.birthday == "") {
                this.allErrors.push(`No Birthday # ${member.row}`)
                member.error.push("Birthday is required")
            }

            if (member.barangay == undefined || member.barangay == "") {
                this.allErrors.push(`No Barangay # ${member.row}`)
                member.error.push("Barangay is required")
            }

            if (member.municipality == undefined || member.municipality == "") {
                this.allErrors.push(`No Municipality # ${member.row}`)
                member.error.push("Municipality is required")
            }

            if (member.province == undefined || member.province == "") {
                this.allErrors.push(`No Province # ${member.row}`)
                member.error.push("Province is required")
            }

            if (member.email == undefined || member.email == "") {
                this.allErrors.push(`No Email # ${member.row}`)
                member.error.push("Email is required")
            }

            if (member.mobile_number == undefined || member.mobile_number == "") {
                this.allErrors.push(`No Mobile Number # ${member.row}`)
                member.error.push("Mobile number is required")
            }
            if (member.mobile_number) {
                if (member.mobile_number.length != 11) {
                    this.allErrors.push(`Mobile Number is not 11 digits # ${member.row}`)
                    member.error.push(`Mobile number is only ${member.mobile_number.length} digits`)
                }
            }
        })
        let { duplicateMobileNumbers } = this.checkDuplicateMobileNumbers();
        if (duplicateMobileNumbers.length > 0) {
            duplicateMobileNumbers.map(duplicateMobileNumber => this.allErrors.push(`Duplicate Mobile Numbers at row ${duplicateMobileNumber.row}`))
        }
        this.membersServices.validateMembers(this.dataSource.data).subscribe(res => {
            const { memberExists } = res;
            if (memberExists.length == 0) {
                this.readyToUpload = true
                this.snackBar.open("All Mobile Numbers are not yet registered. Upload Members to proceed", "", { duration: 3000 })
            }
            if (this.validateQuery) {
                this.membersServices.validateMembers(this.dataSource.data).subscribe(res => {
                    const { memberExists } = res;
                    if (memberExists.length == 0) {
                        this.readyToUpload = true
                        this.snackBar.open("All Mobile Numbers are not yet registered. Upload Members to proceed", "", { duration: 3000 })
                    }
                    if (memberExists.length > 0) {
                        this.readyToUpload = false;
                        memberExists.map((mobileNumber: any) => {
                            this.dataSource.data.map((member: IMemberDataSource) => {
                                if (member.mobile_number == mobileNumber.mobile_number) {
                                    this.allErrors.push(`Mobile Number at row ${member.row} is already exists`)
                                    member.error?.push(`Mobile number is already exists`)
                                }
                            })
                        })
                    }
                })
            }
        })
    }

    validateMember(member: IMemberDataSource) {
        if (member.first_name.trim() == "" || member.last_name.trim() == "" || member.gender.trim() == "" || member.barangay.trim() == "" || member.municipality.trim() == "" || member.province.trim() == "" || member.email.trim() == "" || member.mobile_number.trim() == "") {
            return true
        }
        if (member.mobile_number.length != 11) {
            return true
        }
        else {
            return false
        }
    }

    validateUploadMembers() {
        if (this.allErrors.length > 0) {
            return true
        }
        else {
            return false;
        }
    }

    checkDuplicateMobileNumbers() {
        let duplicateMobileNumbers: any[] = [];
        this.dataSource.data.forEach((member: IMemberDataSource) => {
            let duplicate = this.dataSource.data.filter((filterMember: IMemberDataSource) => filterMember.mobile_number == member.mobile_number && filterMember.row != member.row)
            if (duplicate.length > 0) {
                duplicateMobileNumbers.push({
                    row: member.row,
                    mobile_number: member.mobile_number,
                })
            }
        })
        return { duplicateMobileNumbers }
    }

    uploadMembers() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to Import this members?",
                button_name: "Import",
                action: "import-members",
                members: this.dataSource.data
            }
        }).afterClosed().subscribe(res => {
            if (res) {
                this.dialogRef.close(res)
            }
        })
    }

    checkIfEditingTable() {
        let ifEditing = this.dataSource.data.some((member: IMemberDataSource) => member.isEdit == true)
        return ifEditing
    }

    validateMembers() {
        this.validateQuery = true
        this.isValidating = true;
        this.btnValidate = "Validating Mobile Numbers";
        this.allErrors = []
        this.membersServices.validateMembers(this.dataSource.data).subscribe(res => {
            const { memberExists } = res;
            if (memberExists.length == 0) {
                this.readyToUpload = true
                this.snackBar.open("All Mobile Numbers are not yet registered. Upload Members to proceed", "", { duration: 3000 })
            }
            if (memberExists.length > 0) {
                this.readyToUpload = false;
                memberExists.map((mobileNumber: any) => {
                    this.dataSource.data.map((member: IMemberDataSource) => {
                        if (member.mobile_number == mobileNumber.mobile_number) {
                            this.allErrors.push(`Mobile Number at row ${member.row} is already exists`)
                            member.error?.push(`Mobile number is already exists`)
                        }
                    })
                })
            }
            this.btnValidate = "Validate Mobile Numbers";
            this.isValidating = false;
        })

    }

    importMembers() {
        this.isButtonLoading = true;
        this.btnImport = "Importing";
        this.membersServices.importMembers(this.data.members).subscribe(res => {
            let { message, memberExists, imported_members } = res;
            if (memberExists.length > 0) {
                message = "Selected Members are already exists"
            }
            this.snackBar.open(message, "", { duration: 3000 })
            this.isButtonLoading = false;
            this.btnImport = "Import";
            this.dialogRef.close({
                isImported: true,
                imported_members
            })
        })

    }

    isCreatedMemberInStore: boolean = false;
    createMemberInStore() {
        this.isCreatedMemberInStore = true
        this.membersRegisterService.createMember(this.data.memberForm).subscribe(res => {
            this.isCreatedMemberInStore = false;
            this.dialogRef.close({ res, isCreated: true })
        }, err => {
            this.dialogRef.close(err)
        })
    }

    back() {
        this.router.navigate(['/client/transactions'])
        this.dialogRef.close()
    }

    downloadErrors() {
        console.log(this.failedToImported)
        const dataForExcel: any = []
        this.failedToImported.forEach((row: any) => {
            console.log(row.member)
          dataForExcel.push(Object.values({
              ...row.member,
              errors: row.errors
          }))
        })
        let reportData = {
          title: `Uploading Member Errors`,
          data: dataForExcel,
          headers: ["first_name", "last_name", "gender","birthday", "barangay", "municipality", "province", "email", "mobile_number", "is_active", "store_id", "primary_cook", "working_status", "Errors"],
          columnColorNumber: 8,
          titleMergeCell: {
            from: 'A1',
            to: 'L2'
          }
        }
        this.helperServices.exportExcel(reportData)
    }

}

interface IMemberDataSource {
    row: number;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    barangay: string;
    municipality: string;
    province: string;
    email: string;
    mobile_number: string;
    is_active: string;
    error: string[];
    isEdit: boolean;
}