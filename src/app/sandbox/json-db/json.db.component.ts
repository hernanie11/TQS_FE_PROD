import { Component } from "@angular/core";
import { JsonDbServices } from "./json.db.service";


@Component({
    selector: 'app-json-db',
    templateUrl: './json.db.component.html'
})

export class JsonDbComponent {
    constructor(
        private jsonDbServices: JsonDbServices
    ) {}

    ngOnInit(): void {
          
    }

}