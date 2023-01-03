import { Component } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { ThemePalette } from "@angular/material/core";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { Subscription } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { LayoutAdminServices } from "./layout.admin.service";

type NewType = Subscription;

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout.admin.component.html',
  styleUrls: ['./layout.admin.component.scss']
})

export class LayoutAdminComponent {
  constructor(
    public mediaObserver: MediaObserver,
    private credServices: CredServices,
    private helperServices: HelperServices
  ) { }

  mediaSub: NewType
  deviceXs: boolean = true;
  sidebarOpen: boolean = true;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;

  ngOnInit(): void {
    this.mediaQuery()
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
        this.sidebarOpen = true
      }
    })
  }

}