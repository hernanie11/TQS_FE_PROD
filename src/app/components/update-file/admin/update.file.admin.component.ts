import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { concat, from, of } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";
import { UpdateFileService } from "../update.file.service";
const CryptoJS = require("crypto-js");
// const fs = require("fs");
import { unlink } from 'fs'
import * as path from 'path';
import { MatTable } from "@angular/material/table";


@Component({
    selector: 'app-update-file-admin',
    templateUrl: './update.file.admin.component.html',
    styleUrls: ['./update.file.admin.component.scss']
})

export class UpdateFileAdminComponent {
    constructor(
        private fb: FormBuilder,
        private credServices: CredServices,
        private updateFileServices: UpdateFileService,
        private snackbar: MatSnackBar
    ) { }
    fileUploadForm: FormGroup = this.fb.group({
        storeFiles: ['', Validators.required]
    })

    insertedFiles: number = 0;
    

    uploadStore(store: any) {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(store)
        fileReader.onload = (event) => {
            const result: any = event.target?.result
            const resultObj = JSON.parse(result)
            const storeData = CryptoJS.AES.decrypt(resultObj[0], this.credServices.secretKey);
            var originalData = JSON.parse(storeData.toString(CryptoJS.enc.Utf8))
            this.updateFileServices.updateFile(originalData).subscribe()
        }
    }

    storeUpdateFile: any = []
    isUploading: boolean = false;
    buttonUpload: "Upload" | "Uploading..." | "Uploaded" = "Upload";
    buttonCancel: "Cancel" | "Reset" = "Cancel";
    
    selectedFiles: any = []
    displayedColumns: string[] = [
        "name",
        "status",
    ]

    ngOnInit(): void {
        this.createFolder()
    }

    createFolder() {
        this.updateFileServices.createFolder().subscribe()
    }

    onFileSelected() {
        const {storeFiles} = this.fileUploadForm.value;  
        if(storeFiles.length > 0) {
            this.selectedFiles = storeFiles.map((store: any, index: any) => {
                return { 
                    id: index + 1,
                    name: store.name,
                    isDone: false
                }
            })
        }
    }

    @ViewChild("tblFiles") tblFiles: MatTable<any>
    uploadLength: number = 0;
    uploadingPercentage = 0;
    currentFileUploading: any;
    import() {
        this.isUploading = true;
        const { storeFiles } = this.fileUploadForm.value;
        this.buttonUpload = "Uploading..."

        from(storeFiles).subscribe({
            next: async (store: any) => {
                const fileReader = new FileReader()
                fileReader.readAsBinaryString(store)
                fileReader.onload = (event) => {
                    const result: any = event.target?.result
                    const resultObj = JSON.parse(result)
                    const storeData = CryptoJS.AES.decrypt(resultObj[0], this.credServices.secretKey);
                    const originalData = JSON.parse(storeData.toString(CryptoJS.enc.Utf8)).generate.map((data: any) => { 
                        return {
                            ...data,
                            fileName: store.name
                        }
                    })
                    if(originalData.length > 0) {
                        this.storeUpdateFile.push(originalData)
                    }
                    else {
                        this.selectedFiles.map((file: any) => {
                            this.updateFileServices.moveUpdateFile(file.name).subscribe()
                            file.isDone = true
                        })
                        this.tblFiles.renderRows()
                    }

                }
            },
            complete: () => {
                setTimeout(() => {
                    this.uploadLength = this.storeUpdateFile.length
                    if(this.uploadLength > 0) {
                        concat(
                            ...this.storeUpdateFile.map((store: any) => this.updateFileServices.updateFile(store))
                        ).subscribe({
                            next: (res: any) => {
                                let index = this.selectedFiles.findIndex((file: any) => file.name == res.fileName)
                                this.selectedFiles[index].isDone = true
                                this.tblFiles.renderRows()
                                this.uploadingPercentage = this.uploadingPercentage + 1 / this.uploadLength * 100
                                this.insertedFiles++;
                                this.updateFileServices.moveUpdateFile(res.fileName).subscribe()
                            },
                            error: (err) => {
                                console.log(`error ya `, err)
                            },
                            complete: () => {
                                this.isUploading = false
                                this.buttonUpload = "Uploaded";
                                this.buttonCancel = "Reset";
                                this.snackbar.open("Store Databases are successfully uploaded", "", { duration: 3000 })
                            }
                        })
                    }
                    else {
                        this.snackbar.open("Store Databases are up to date", "", { duration: 3000 })
                        this.buttonUpload = "Upload";
                        this.isUploading = false
                    }
                    
                }, 100);
            }
        })

    }

    cancelOrReset() {
        this.fileUploadForm.reset()
        this.buttonCancel = "Cancel";
        this.buttonUpload = "Upload"
        this.selectedFiles = []
        this.uploadingPercentage = 0
        this.storeUpdateFile = []
        this.isUploading = false
        this.insertedFiles = 0
    }
}