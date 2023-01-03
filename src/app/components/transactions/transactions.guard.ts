import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AppServices } from "src/app/app.service";

@Injectable({
    providedIn: "root"
})

export class TransactionsGuard implements CanActivate{
    constructor(
        private appServices: AppServices,
        private router: Router
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(!this.appServices.internetForm.value.isOnline) {
            this.router.navigate(['/clients/transactions'])
            return false
        }
        return true;
    }

}