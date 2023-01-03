import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredServices } from "../shared/services/cred.service";
import { LocalService } from "../shared/services/local.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../shared/components/dialog/dialog.component";
@Injectable({
    providedIn: "root"
})

export class ClientAccessGuard implements CanActivate {
    constructor(
        private jwtHelper: JwtHelperService,
        private credServices: CredServices,
        private router: Router,
        private localService: LocalService,
        private dialog: MatDialog
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let client_token = this.credServices.getCredentials().client_token;
        if(client_token && !this.jwtHelper.isTokenExpired(client_token)) {
            return true
        }
        else {
            this.dialog.open(DialogComponent, {
                disableClose: true,
                data: {
                    title: "Session Expired",
                    content: "Please Login In Again",
                }
            })
            this.router.navigate(['/login'])
            this.localService.clearToken()   
            return false
        }
    }
}