import { Component, ElementRef, ViewChild } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-name',
    templateUrl: './name.component.html',
    styleUrls: ['./name.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class NameComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

    @ViewChild("txtFirstName") txtFirstName: ElementRef

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.ctrlKey && e.key == "ArrowRight") {
            this.next()
        }
        if(e.ctrlKey && e.key == "ArrowLeft") {
            this.back()
        }
        if(e.key == "Enter") {
            this.next()
        }
    }

    ngAfterViewInit(): void {
        this.focusFirstName()    
    }

    focusFirstName() {
        setTimeout(() => {
            this.txtFirstName.nativeElement.focus()
        }, 0);
    }


    addNumber(value: string) {
        this.membersRegisterServices.mobile_number += value;
    }

    remove() {
        this.membersRegisterServices.mobile_number = this.membersRegisterServices.mobile_number.slice(0, -1)
    }

    next() {
        if(!this.validateFields()) {
            this.membersRegisterServices.steps = "Gender";
        }
    }

    back() {
        this.membersRegisterServices.steps = "Mobile Number";
    }

    validateFields() {
        if(this.membersRegisterServices.first_name.trim() == '' || this.membersRegisterServices.last_name.trim() == '') {
            return true
        }
        return false;
    }
}