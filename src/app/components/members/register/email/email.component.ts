import { Component, ElementRef, ViewChild } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class EmailComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) { }

    @ViewChild("txtEmail") txtEmail: ElementRef

    ngAfterViewInit(): void {
        this.focusEmail()
    }

    focusEmail() {
        setTimeout(() => {
            this.txtEmail.nativeElement.focus()
        }, 0);
    }

    handleKeyboardEvent(e: KeyboardEvent) {
        if (e.ctrlKey && e.key == "ArrowRight") {
            this.next()
        }
        if (e.ctrlKey && e.key == "ArrowLeft") {
            this.back()
        }
        if (e.key == "Enter") {
            this.next()
        }
    }

    next() {
        this.membersRegisterServices.steps = "Working";
    }

    back() {
        this.membersRegisterServices.steps = "Address"
    }

    validateFields() {
        return false;
    }
}