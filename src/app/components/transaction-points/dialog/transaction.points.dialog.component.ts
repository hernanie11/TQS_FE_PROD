import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CredServices } from "src/app/shared/services/cred.service";
import { TransactionPointsService } from "../transaction.points.service";

@Component({
    selector: 'app-transaction-points-dialog',
    templateUrl: './transaction.points.dialog.component.html',
    styleUrls: ['./transaction.points.dialog.component.scss']
})

export class TransactionPointsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<TransactionPointsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private transactionPointServices: TransactionPointsService,
        private credServices: CredServices,
        private snackbar: MatSnackBar
    ) { }

    voidString: string = "";
    buttonVoid: "Void" | "Voiding..." | "Voided" = "Void";
    buttonCancel: "Cancel" | "Close" = "Cancel";
    void() {
        this.isVoiding = true;
        this.buttonVoid = "Voiding..."
        this.transactionPointServices.void(this.data.earnedId, this.credServices.getCredentials().client_user._id).subscribe(res => {
            const { body: { voidedEarned: { _id, void_by, void_date }, message } } = res;
            this.buttonVoid = "Voided";
            this.buttonCancel = "Close";
            this.isVoiding = false;
            this.snackbar.open(message, "", { duration: 3000 })
            this.dialogRef.close({ isVoided: true, _id, void_by, void_date })
        })
    }

    validateVoid() {
        let result = this.data.randomText.localeCompare(this.voidString)
        if (result != 0) {
            return true
        }
        return false;
    }

    isVoiding: boolean = false;
    cancel() {
        this.dialogRef.close({
            isVoided: false
        })
    }
}