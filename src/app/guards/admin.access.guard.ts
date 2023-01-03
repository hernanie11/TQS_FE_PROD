import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CredServices } from "../shared/services/cred.service";
import { LocalService } from "../shared/services/local.service";

@Injectable({
    providedIn: "root"
})

export class AdminAccessGuard implements CanActivate {
    constructor(
        private credServices: CredServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const { user: { access_permission } } = this.credServices.getCredentials();
        const { url } = state
        const routeModule = url.split("/")[2];
        // console.log(`access_permission`, access_permission)
        let hasAccess = access_permission.some((access: string) => access == routeModule)
        
        let hasStore = access_permission.some((access: string) => access == "stores")
        if(hasStore) {
            if(routeModule == "store-codes") return true
            if(routeModule == "areas") return true
            if(routeModule == "regions") return true
            if(routeModule == "clusters") return true
            if(routeModule == "business-model") return true
        }
        if(!hasAccess) {
            this.router.navigate(["/admin/unauthorized"])
        }
        
        return true;
    }

}