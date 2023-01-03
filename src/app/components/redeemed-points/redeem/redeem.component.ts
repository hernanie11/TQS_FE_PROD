import { isPlatformBrowser } from "@angular/common";
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AppServices } from "src/app/app.service";
import { CredServices } from "src/app/shared/services/cred.service";
import { EarnService } from '../../earned-points/earn/earn.service'
import { RedeemedPointsDialogComponent } from "../dialog/redeemed.points.dialog.component";
import { RedeemService } from "./redeem.service";

@Component({
    selector: 'app-redeem',
    templateUrl: './redeem.component.html',
    styleUrls: ['./redeem.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class RedeemComponent {
    constructor(
        private router: Router,
        private snackbar: MatSnackBar,
        private credServices: CredServices,
        private fb: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object,
        private redeemServices: RedeemService,
        private dialog: MatDialog,
        private appServices: AppServices
    ) { }

    @ViewChild("txtMobileNumber") txtMobileNumber: ElementRef
    @ViewChild("txtRedeemPoints") txtRedeemPoints: ElementRef

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.key == "Escape") {
            this.router.navigate(["/client/transactions"])
        }
    }

    ngDoCheck(): void {
        if(!this.appServices.internetForm.value.isOnline) {
            this.router.navigate(['/client/transactions'])
        }
    }

    ngAfterViewInit(): void {
        this.focusMobileNumber()    
    }


    focusMobileNumber() {
        setTimeout(() => {
            this.txtMobileNumber.nativeElement.focus()
        }, 0);
    }

    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }

    redeemForm: FormGroup = this.fb.group({
        mobile_number: [''],
        redeemPoints: [''],
    })

    back() {
        this.router.navigate(['/client/transactions'])
    }

    copy() {
        this.snackbar.open("Referrence # copied to clipboard", "", {
            duration: 3000
        })
    }

    isMobileNumberExists: boolean = false;
    totalClearedPoints: number = 0;
    memberId: number;
    memberObjectId: any;
    token: string;
    referenceNo: string;
    isValidating: boolean = false;
    checkMobileNumber() {
        const { mobile_number } = this.redeemForm.value;
        const form = { mobilenumber: mobile_number }
        this.isValidating = true;
        this.redeemServices.validateMobileNumber(form).subscribe(res => {
            const { is_exists, clearedpoints, member_id, token, message } = res;
            this.redeemServices.getMemberByMysqlId(mobile_number).subscribe(memberResponse => {
                this.memberObjectId = memberResponse._id,
                this.isMobileNumberExists = is_exists;
                this.totalClearedPoints = clearedpoints;
                this.memberId = member_id;
                this.token = token;
                this.isValidating = false;
                if (is_exists) {
                    setTimeout(() => {
                        this.txtRedeemPoints.nativeElement.focus()
                        this.redeemForm.controls.mobile_number.disable()
                    }, 100);
                }
                else {
                    this.snackbar.open(message, "", { duration: 3000 })
                }
            })
            
          
        }, err => {
            this.isValidating = false;
        })
    }

    validateForm() {
        if(this.redeemForm.value.redeemPoints > this.totalClearedPoints || this.redeemForm.value.redeemPoints == '' || this.buttonName == "Redeemed"|| this.redeemForm.value.redeemPoints == 0 || this.totalClearedPoints <= 0 || this.redeemForm.value.redeemPoints == '.') {
            return true
        }
        return false
    }

    buttonName: "Redeem" | "Redeemed" = "Redeem";
    redeem() {
        const form = {
            member_id: this.memberId,
            points_redeemed: this.redeemForm.value.redeemPoints,
            store_id: this.credServices.getCredentials().activated_store.store_mysql_id,
            user_id: this.credServices.getCredentials().client_user.user_mysql_id,
            store_token: this.credServices.getCredentials().activated_store.token
        }
        const saveRedeemedPointsInLocalStorage = {
            member_id: this.memberId,
            member_object_id: this.memberObjectId,
            redeemed_points: this.redeemForm.value.redeemPoints,
            transact_by: this.credServices.getCredentials().client_user._id
        }
      
        this.dialog.open(RedeemedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to redeem this points?",
                action: "redeem",
                button_name: "Redeem",
                redeemForm: form,
                token: this.token,
                saveRedeemedPointsInLocalStorage
                
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isRedeemed, reference_no } = dialogResponse
            if(isRedeemed) {
                this.buttonName = "Redeemed";
                this.redeemForm.disable();
                this.referenceNo = reference_no;
                this.snackbar.open("Points Successfully Redeemed!", "", {
                    duration: 3000
                })
            }
        })
    }

    reset() {
        this.redeemForm.enable()
        this.redeemForm.patchValue({
            mobile_number: [''],
            redeemPoints: [''],
        })
        this.buttonName = "Redeem";
        this.isMobileNumberExists = false;
    }

    remainingAvailablePoints() {
        return Number(this.totalClearedPoints) - Number(this.redeemForm.value.redeemPoints)
    }

    ok() {
        this.dialog.open(RedeemedPointsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Earn Points?",
                action: "earnPoints",
                button_name: "Earn"
            }
        }).afterClosed().subscribe(dialogResponse => {
            if(dialogResponse == true) {
                this.router.navigate(['/client/transactions/earn-points', { mobileNumber: this.redeemForm.value.mobile_number }])
            }
            if(dialogResponse == false) {
                this.redeemForm.enable()
                this.redeemForm.patchValue({
                    mobile_number: [''],
                    redeemPoints: [''],
                })
                this.buttonName = "Redeem";
                this.isMobileNumberExists = false;
            }
        })
    }
}