import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-working',
    templateUrl: './working.component.html',
    styleUrls: ['./working.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class WorkingComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

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

    next() {
        // if(!this.validateFields()) {
        //     this.membersRegisterServices.steps = "Cooking"
        // }
        this.membersRegisterServices.steps = "Cooking"
    }

    back() {
        this.membersRegisterServices.steps = "Email"
    }

    validateFields() {
        if(this.membersRegisterServices.working == '') {
            return true;
        }
        return false;
    }
}