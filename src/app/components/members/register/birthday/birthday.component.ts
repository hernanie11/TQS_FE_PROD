import { Component, ElementRef, ViewChild } from "@angular/core";
import * as moment from "moment";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class BirthdayComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    minDate = moment().subtract(100, 'years').toDate();
    maxDate = moment().subtract(18, 'years').toDate();
    @ViewChild("txtBirthday") txtBirthday: ElementRef

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.ctrlKey && e.key == "ArrowLeft") {
            this.back()
        }
        if(e.ctrlKey && e.key == "ArrowRight") {
            this.next()
        }
        if(e.key == "Enter") {
            this.next()
        }
    }

    ngAfterViewInit(): void {
        this.focusPicker()
    }

    focusPicker() {
        setTimeout(() => {
            this.txtBirthday.nativeElement.focus()
        }, 0);
    }

    next() {
        if(!this.validateFields()) {
            this.membersRegisterServices.steps = "Address";
        }
    }

    back() {
        this.membersRegisterServices.steps = "Gender"
    }

    validateFields() {
        if(this.membersRegisterServices.birthday == '') {
            return true
        }
        return false;
    }
}