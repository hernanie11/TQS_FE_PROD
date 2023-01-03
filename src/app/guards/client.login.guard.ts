import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from "../shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ClientLoginGuard implements CanActivate {
    constructor(
        private credServices: CredServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let user = this.credServices.getCredentials().client_user;
        if(user) {
            this.router.navigate(['/client/transactions'])
        }
        return true;
    }


}