import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppServices } from "src/app/app.service";

@Component({
    selector: 'app-getting-started',
    templateUrl: './getting.started.component.html',
    styleUrls: ['./getting.started.component.scss']
})

export class GettingStartedComponent {
    constructor(
        private router: Router,
        public appService: AppServices
    ) {}
    gettingStarted: boolean = false;
    buttonName: "Get Started" | "Getting Started..." = "Get Started";
    getStarted() {
        this.gettingStarted = true;
        this.buttonName = "Getting Started...";
        setTimeout(() => {
            this.gettingStarted = false;
            this.router.navigate(['/portal/installation'])
        }, 0);
    }
}