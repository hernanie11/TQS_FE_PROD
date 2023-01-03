import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AppServices } from "../app.service";
import { PortalServices } from "../components/portal/portal.service";

@Injectable({
    providedIn: "root"
})

export class IsStoreActivated implements CanActivate {
    constructor(
        private portalServices: PortalServices,
        private router: Router,
        private appService: AppServices
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const { url } = state
        const routeModule = url.split("/")[2];
        this.portalServices.checkIfStoreIsActivated().subscribe(res => {
            this.appService.isServerStarted = true;
            const { isActivated } = res;
            if(!isActivated) {
                switch(routeModule) {
                    case "getting-started" :
                        this.router.navigate(['/portal/getting-started']);
                        break;
                    case "installation":
                        this.router.navigate(['/portal/installation']);
                        break;
                    default :
                        this.router.navigate(['/portal/getting-started']);
                }
                return false;
            }
            else {
                this.router.navigate(['/login'])
                return true;
            }
        }, err => {
            console.error(`server error`, err)
            this.appService.isServerStarted = false;
        })
        
        return true;
    }

}