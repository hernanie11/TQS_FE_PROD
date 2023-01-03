import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from '../shared/services/cred.service'
@Injectable({
    providedIn: `root`
})

export class AuthGuard implements CanActivate {

    constructor(
        private credServices: CredServices,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let { token } = this.credServices.getCredentials()
        if(token) {
            return true
        }
        else {
            this.router.navigate([""])
            return false;
        }
    }

}