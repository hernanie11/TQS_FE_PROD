import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-child',
    templateUrl: './child.component.html'
})

export class ChildComponent {
    @Input() student: TStudentInput

    @Input() name: string;

    @Input() isVirgin: boolean;
    @Input() cars: string[];
    @Input() students: {
        fname: string;
        lname: string;
        age: number
    }[]
}

export type TStudentInput = {
    fname: string;
    lname: string;
    age: number
}

