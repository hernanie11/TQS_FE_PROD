import { Component } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-cooking',
    templateUrl: './cooking.component.html',
    styleUrls: ['./cooking.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class CookingComponent {
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
        //     this.membersRegisterServices.steps = "Overview"
        // }
        this.membersRegisterServices.steps = "Overview"
    }

    back() {
        this.membersRegisterServices.steps = "Working"
    }

    validateFields() {
        if(this.membersRegisterServices.cooking == '') {
            return true
        }
        return false
    }
}