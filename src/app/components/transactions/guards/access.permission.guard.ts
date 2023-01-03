import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";

@Injectable({
    providedIn: "root"
})

export class ClientAccessPermissionGuard implements CanActivate {
    constructor(
        private helperServices: HelperServices,
        private credServices: CredServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const { access_permission } = this.credServices.getCredentials().client_user
        const { url } = state;
        const routeModule = url.split("/")[3];
        if(routeModule == "register-customer" || routeModule == "customer-info") {
            let hasAccess = access_permission.some((acc: string) => acc == "members")
            if(!hasAccess) this.router.navigate(["/client/transactions"])
        }
        if(routeModule == "earn-points") {
            let hasAccess = access_permission.some((acc: string) => acc == "earning")
            if(!hasAccess) this.router.navigate(["/client/transactions"])
        }
        if(routeModule == "redeem-points") {
            let hasAccess = access_permission.some((acc: string) => acc == "redeeming")
            if(!hasAccess) this.router.navigate(["/client/transactions"])
        }
        if(routeModule == "transaction-points") {
            let hasAccess = access_permission.some((acc: string) => acc == "transactions")
            if(!hasAccess) this.router.navigate(["/client/transactions"])
        }
        return true
    }
}