import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { EarnService } from "./earn.service";
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { EarnedPointsDialogComponent } from "../dialog/earned.points.dialog.component";
@Component({
    selector: 'app-earn',
    templateUrl: './earn.component.html',
    styleUrls: ['./earn.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class EarnPointsComponent {
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private credServices: CredServices,
        private earnServices: EarnService,
        private snackbar: MatSnackBar,
        @Inject(PLATFORM_ID) private platformId: Object,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) { }

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.key == "Escape") {
            this.router.navigate(["/client/transactions"])
        }
    }

    earningPointsSettings: any;
    isMobileNumberExists: boolean = false;
    queryMobileNumber = this.route.snapshot.params['mobileNumber'];

    @ViewChild("txtMobileNumber") txtMobileNumber: ElementRef
    @ViewChild("txtTransactionNo") txtTransactionNo: ElementRef

    ngOnInit(): void {
        this.getUpdatedEearningPointsPercentage()
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

    getUpdatedEearningPointsPercentage() {
        this.earnServices.getUpdatedEarningPointsPercentage().subscribe(res => {
            this.earningPointsSettings = res;
            this.earnForm.patchValue({ based_computation: res.earning_percentage })
        })

        if(this.queryMobileNumber) {
            this.earnForm.patchValue({
                mobile_number: this.queryMobileNumber
            })
            this.checkMobileNumber()
        }
    }

    memberObject: any;
    checkMobileNumber() {
        const { mobile_number } = this.earnForm.value;
        if (mobile_number.length == 11) {
            this.earnServices.validateMobileNumber(mobile_number).subscribe(res => {
                const { isExists, member } = res;
                this.memberObject = member;
                 this.isMobileNumberExists = isExists
                this.earnForm.controls.mobile_number.disable()
                setTimeout(() => {
                    this.txtTransactionNo.nativeElement.focus()
                }, 0);

            }, err => {
                const { error: { message, isExists } } = err;
                this.isMobileNumberExists = isExists;
                this.snackbar.open(message, "", { duration: 3000 })
               
            })
        }
    }

    earnForm: FormGroup = this.fb.group({
        store_mysql_id: [''],
        mobile_number: [],
        member_id: [''],
        transaction_no: [''],
        based_computation: [''],
        bought_amount: [''],
        earned_points: [''],
        created_by: [this.credServices.getCredentials().client_user.user_mysql_id]
    })

    earnPointsPercentage() {
        let earnedPoints = this.earnForm.value.bought_amount * this.earnForm.value.based_computation;
        return Number(earnedPoints.toFixed(2))
    }

    validateForm() {
        const { transaction_no, bought_amount } = this.earnForm.value;
        if (transaction_no == '' || Number(bought_amount) <= 0 || this.isPointsEarned == true) {
            return true
        }
        return false;
    }

    isPointsEarned: boolean = false;
    earn() {
        this.earnForm.patchValue({ 
            store_mysql_id: this.credServices.getCredentials().activated_store.store_mysql_id,
            earned_points: this.earnPointsPercentage(),
            bought_amount: Number(this.earnForm.value.bought_amount),
            member_id: this.memberObject._id
        })
        this.dialog.open(EarnedPointsDialogComponent, {
            disableClose: true,
            data: {
                earnForm: this.earnForm.value,
                title: "Confirmation",
                question: "Are you sure you want to earn this points?",
                action: 'earn-points',
                button_name: 'Earn',
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isEarned } = dialogResponse;
            this.isPointsEarned = isEarned
            if(isEarned) {
                this.router.navigate(['/client/transactions/transaction-points'])
            }
        })
    }

    reset() {
        this.earnForm.patchValue({
            mobile_number: '',
            transaction_no: '',
            bought_amount: '',
            earned_points: ''
        })
        this.router.navigate(['/client/transactions/earn-points'])
        this.queryMobileNumber = ""
        this.isPointsEarned = false;
        this.isMobileNumberExists = false;
        this.earnForm.enable()
        this.getUpdatedEearningPointsPercentage()
        this.focusMobileNumber()
    }

    back() {
        this.router.navigate(['/client/transactions'])
    }

    isEarning: boolean = false;
}