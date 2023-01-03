import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SettingsServices } from "../settings.service";

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings.dialog.component.html',
    styleUrls: ['./settings.dialog.component.scss']
})

export class SettingsDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)public data: any,
        private dialogRef: MatDialogRef<SettingsDialogComponent>,
        private settingsServices: SettingsServices,
        private snackbar: MatSnackBar
    ) {}

    isButtonLoading: boolean = false;
    buttonName: "Save" | "Saving" = "Save";

    save() {
        this.isButtonLoading = true;
        this.buttonName = "Saving";
        const { settings: {earningPointsPercentage, remarks} } = this.data;
        this.settingsServices.updateEarningPointsPercentage(earningPointsPercentage, remarks).subscribe(res => {
            const { code, message, updated_percentage } = res;
            this.isButtonLoading = false;
            this.buttonName = "Save";
            this.snackbar.open(message, "", {
                duration: 3000
            })
            this.dialogRef.close({updated_percentage})
        }, err => {
            const { error: {message} } = err;
            this.snackbar.open(message, "", {
                duration: 3000
            })
            this.isButtonLoading = false;
            this.buttonName = "Save";
        })
        
    }
}