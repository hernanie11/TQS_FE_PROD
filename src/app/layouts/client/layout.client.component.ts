import { Component } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { ThemePalette } from "@angular/material/core";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { Subscription } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

type NewType = Subscription;

@Component({
    selector: 'app-layout-client',
    templateUrl: './layout.client.component.html',
    styleUrls: ['./layout.client.component.scss']
})

export class LayoutClientComponent {
    constructor(
        public mediaObserver: MediaObserver,
        private credServices: CredServices
    ) { }

    mediaSub: NewType
    deviceXs: boolean = true;
    sidebarOpen: boolean = false;

    color: ThemePalette = 'primary';
    mode: ProgressBarMode = 'determinate';
    value = 50;
    bufferValue = 75;

    ngOnInit(): void {
        this.mediaQuery()
        console.log(this.credServices.getCredentials())
    }

    ngOnDestroy(): void {
        this.mediaSub.unsubscribe();
    }


    SideBarToggler() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    mediaQuery() {
        this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
            this.deviceXs = result.mqAlias === 'xs' ? true : false
            if (this.deviceXs == true) {
                this.sidebarOpen = false
            }
            else {
                // this.sidebarOpen = true
            }
        })
    }
}