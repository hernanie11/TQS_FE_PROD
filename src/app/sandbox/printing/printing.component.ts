import { Component } from "@angular/core";
import { NgxPrintDirective } from "ngx-print";

@Component({
    selector: 'app-printing',
    templateUrl: './printing.component.html',
    styleUrls: ['./printing.component.scss']
})

export class PrintingComponent {
    constructor(
        private printDirective: NgxPrintDirective
    ) {

    }
}