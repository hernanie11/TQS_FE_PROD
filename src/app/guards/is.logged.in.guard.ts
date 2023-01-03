import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LayoutAdminServices } from "../layouts/admin/layout.admin.service";
import { DialogComponent } from "../shared/components/dialog/dialog.component";
import { LocalService } from "../shared/services/local.service";

@Injectable({
    providedIn: "root"
})

export class IsLoggedIn implements CanActivate {

    constructor(
        private layoutAdminServices: LayoutAdminServices,
        private localService: LocalService,
        private router: Router,
        private dialog: MatDialog
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.layoutAdminServices.checkIfLoggedIn().subscribe(res => {
            const { isLoggedIn } = res;
            if (!isLoggedIn) {
                this.router.navigate([""])
                return false
            }
            return true
        }, err => {
            console.log(err);
            const { status } = err
            if(status == 401) {
                this.dialog.open(DialogComponent, {
                    disableClose: true,
                    data: {
                        title: "Session Expired",
                        content: "Please Login In Again",
                    }
                })
                this.router.navigate([""])
                this.localService.clearToken()
            }
            
        })
        return true
    }

}