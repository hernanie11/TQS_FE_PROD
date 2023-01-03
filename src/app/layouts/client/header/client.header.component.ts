import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ChangePasswordComponent } from "src/app/components/change-password/change.password.component";
import { ChangeStoreComponent } from "src/app/components/change-store/change-store.component";
import { CredServices } from "src/app/shared/services/cred.service";
import { LocalService } from "src/app/shared/services/local.service";

@Component({
    selector: 'app-client-header',
    templateUrl: './client.header.component.html',
    styleUrls: ['./client.header.component.scss']
})

export class ClientHeaderComponent {
    constructor(
        private localService: LocalService,
        private router: Router,
        public credServices: CredServices,
        private dialog: MatDialog
    ) {}
    @Output() toogleSidebar: EventEmitter<any> = new EventEmitter();
    @Input() deviceXs: boolean
    loggingOut: boolean = false;
    hasChangeStoreAccess: boolean = false;
    ngOnInit(): void {
        this.hasChangeStoreAccess = this.credServices.getCredentials().client_user.access_permission.some((access_permission: any) => access_permission == "change-store")
    }
    ToogleSideBar() {
        this.toogleSidebar.emit();
        setTimeout(() => {
          window.dispatchEvent(
            new Event('resize')
          )
        }, 300);
    }

    changePasword() {
        this.dialog.open(ChangePasswordComponent, {
            disableClose: true,
            data: {
                title: "Change Password",
                action: "change-password-client"
            }
        })
    }

    logout() {
        this.localService.clearToken();
        this.router.navigate(['/login']).then(() => location.reload())
    }

    changeStore() {
        this.dialog.open(ChangeStoreComponent, {
            disableClose: true,
            width: "450px",
            data: {
                action: "change-store"
            }
        })
    }
    
}