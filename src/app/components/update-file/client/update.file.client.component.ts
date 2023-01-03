import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CredServices } from "src/app/shared/services/cred.service";
import { UpdateFileService } from "../update.file.service";
const CryptoJS = require("crypto-js");
@Component({
    selector: 'app-update-file-client',
    templateUrl: './update.file.client.component.html',
    styleUrls: ['./update.file.client.component.scss']
})

export class UpdateFileClientComponent {
    constructor(
        private fb: FormBuilder,
        private credServices: CredServices,
        private updateFileServices: UpdateFileService,
        private snackbar: MatSnackBar
    ) { }
    fileUploadForm: FormGroup = this.fb.group({
        storeFiles: ['', Validators.required]
    })

    isUploading: boolean = false;
    buttonUpload: "Upload" | "Uploading..." | "Uploaded" = "Upload";
    buttonCancel: "Cancel" | "Reset" = "Cancel";

    import() {
        this.isUploading = true;
        this.buttonUpload = "Uploading..."
        const { storeFiles } = this.fileUploadForm.value;
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(storeFiles)
        fileReader.onload = (event) => {
            const result: any = event.target?.result
            const resultObj = JSON.parse(result)
            const storeData = CryptoJS.AES.decrypt(resultObj[0], this.credServices.secretKey);
            const originalData = JSON.parse(storeData.toString(CryptoJS.enc.Utf8))
            this.updateFileServices.updateClientFile(originalData).subscribe(res => {
                
            }, err => {

            }, () => {
                this.isUploading = false;
                this.buttonUpload = "Uploaded";
                this.buttonCancel = "Reset";
                this.snackbar.open("Uploading Database Done", "", { duration: 10000 })
            })

        }
    }

    cancelOrReset() {
        this.fileUploadForm.reset()
        this.buttonCancel = "Cancel";
        this.buttonUpload = "Upload";
    }
}
