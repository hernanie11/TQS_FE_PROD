import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from "../shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class LoginGuard implements CanActivate {

    constructor(
        private credServices: CredServices,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let { user } = this.credServices.getCredentials();
        if(user) {
            const { role } = user;
            if(role == "admin") {
                this.router.navigate(["/admin/user-accounts"])
            }
        }
        return true;
    }

}