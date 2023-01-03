import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { SidebarServices } from "../shared/layouts/sidebar/sidebar.service";

@Injectable({
    providedIn: "root"
})

export class SidebarCssSelected implements CanActivate {
    constructor(
        private sideBarServices: SidebarServices,
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const { url } = state
        const routeModule = url.split("/")[2];
        this.sideBarServices.userAccountSelected(routeModule)
        
        return true
    }

}