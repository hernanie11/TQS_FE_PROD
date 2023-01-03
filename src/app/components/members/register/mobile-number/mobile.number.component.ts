import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-mobile-number',
    templateUrl: './mobile.number.component.html',
    styleUrls: ['./mobile.number.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class MobileNumberComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices,
        private snackBar: MatSnackBar
    ) { }

    isValidating: boolean = false;

    @ViewChild("txtMobileNumber") txtMobileNumber: ElementRef

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.ctrlKey && e.key == "ArrowRight") {
            if (this.validateNextButton()) {
                this.next()
            }
        }
    }

    ngAfterViewInit(): void {
        this.focusMobileNumberOnLoad()
    }

    focusMobileNumberOnLoad() {
        setTimeout(() => {
            this.txtMobileNumber.nativeElement.focus()
        }, 0);
    }

    focusMobileNumber() {
        if (this.fieldValidation()) {
            this.txtMobileNumber.nativeElement.focus()
        }

    }

    fieldValidation() {
        let mobileNumber = this.membersRegisterServices.mobile_number.toString()
        if (mobileNumber.length != 11 || this.isValidating) {
            return true;
        }
        return false;
    }

    validateButton() {
        if (this.membersRegisterServices.isMobileNumberExists == true || this.membersRegisterServices.validatedMobileNumber != this.membersRegisterServices.mobile_number) {
            return true
        }
        return false
    }

    validateNextButton() {
        if (this.membersRegisterServices.isMobileNumberExists == false && this.membersRegisterServices.validatedMobileNumber == this.membersRegisterServices.mobile_number) {
            return true
        }
        return false;
    }

    addNumber(value: string) {
        this.membersRegisterServices.mobile_number += value;
    }

    remove() {
        this.membersRegisterServices.mobile_number = this.membersRegisterServices.mobile_number.slice(0, -1)
    }

    next() {
        if(this.validateNextButton()) {
            this.membersRegisterServices.steps = "Name";
        }

    }

    validate() {
        if (this.fieldValidation()) {
            this.snackBar.open("Mobile Number must be at least 11 digits", "", {
                duration: 3000
            })
        }
        else {
            if (this.membersRegisterServices.mobile_number.substring(0, 2).toString() != "09") {
                this.txtMobileNumber.nativeElement.focus()
                this.snackBar.open("Mobile Number prefix must be 09", "", {
                    duration: 3000
                })
            }
            else {
                if (this.validateNextButton()) {
                    this.next()
                }
                else {
                    this.isValidating = true;
                    this.membersRegisterServices.validateMobileNumber().subscribe(res => {
                        const { mobileNumber } = res;
                        this.membersRegisterServices.validatedMobileNumber = mobileNumber;
                        this.isValidating = false;
                        this.membersRegisterServices.isMobileNumberExists = false;
                        this.membersRegisterServices.can_access_layer = "Name"
                    }, err => {
                        const { statusText } = err;
                        this.isValidating = false;
                        this.membersRegisterServices.isMobileNumberExists = true;
                        this.snackBar.open("Mobile Number is already exists", "", {
                            duration: 3000
                        })
                    })
                }
            }

        }

    }
}