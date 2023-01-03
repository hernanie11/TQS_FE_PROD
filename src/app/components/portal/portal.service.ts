import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class PortalServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    checkIfStoreIsActivated(): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/store-activate/check-if-activated`)
    }

    activateStore(token: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/activate-store`, {token}, { observe: 'response' })
    }
}