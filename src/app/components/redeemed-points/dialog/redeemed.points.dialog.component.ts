import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RedeemService } from "../redeem/redeem.service";
import { RedeemedPointsServices } from "../redeemed-points.service";

@Component({
    selector: 'app-redeemed-points-dialog',
    templateUrl: './redeemed.points.dialog.component.html',
    styleUrls: ['./redeemed.points.dialog.component.scss']
})

export class RedeemedPointsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<RedeemedPointsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private redeemServices: RedeemService,
        private snackbar: MatSnackBar,
        private redeemedPointsServices: RedeemedPointsServices
    ) { }

    isRedeeming: boolean = false;

    redeem() {
        this.isRedeeming = true;
        this.redeemServices.redeem(this.data.redeemForm, this.data.token).subscribe(res => {
            this.redeemServices.saveRedeemInLocalStorage(this.data.saveRedeemedPointsInLocalStorage).subscribe(localStorageRedeemedResponse => {
                this.dialogRef.close({ isRedeemed: true, reference_no: res.reference_no })
            })

           
        }, err => {
            this.snackbar.open("Unauthorized", "", {
                duration: 3000
            })
            this.dialogRef.close({ isRedeemed: false })
        })
    }

    cancel() {
        this.dialogRef.close({ isRedeemed: false })
    }

    validateVoid() {
        // if (this.voidString.toLowerCase() != "void") {
        //     return true
        // }
        // return false;
        let result = this.data.randomText.localeCompare(this.voidString)
        if(result != 0) {
            return true
        }
        return false;
    }

    voidString: string = "";
    isVoiding: boolean = false;
    void() {
        this.isVoiding = true
        this.redeemedPointsServices.void(this.data.redeemedPointId).subscribe(res => {
            this.isVoiding = false
            const { body: { id, message } } = res;
            this.dialogRef.close({ id })
            this.snackbar.open(message)
        })
    }
}