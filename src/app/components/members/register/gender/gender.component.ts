import { Component, ElementRef, ViewChild } from "@angular/core";
import { MembersRegisterServices } from "../members.register.service";

@Component({
    selector: 'app-gender',
    templateUrl: './gender.component.html',
    styleUrls: ['./gender.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class GenderComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices
    ) {}

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


    
    next() {
        if(!this.validateFields()) {
            this.membersRegisterServices.steps = "Birthday"
        }
    }

    back() {
        this.membersRegisterServices.steps = "Name"
    }

    validateFields() {
        if(this.membersRegisterServices.gender == '') {
            return true
        }
        return false;
    }
    
}