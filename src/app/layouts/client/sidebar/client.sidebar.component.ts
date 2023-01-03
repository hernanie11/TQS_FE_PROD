import { Component } from "@angular/core";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";

@Component({
    selector: 'app-client-sidebar',
    templateUrl: './client.sidebar.component.html',
    styleUrls: ['./client.sidebar.component.scss']
})

export class ClientSidebarComponent {
    constructor(
        public credServices: CredServices,
        public helperServices: HelperServices
    ) {}
    
}