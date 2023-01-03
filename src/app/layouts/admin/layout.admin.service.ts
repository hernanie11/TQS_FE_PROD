import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class LayoutAdminServices {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}
    
    checkIfLoggedIn(): Observable<{isLoggedIn: boolean}> {
        let { token } = this.credServices.getCredentials();
        return this.http.post<{isLoggedIn: boolean}>(`${this.credServices.port}/isLoggedIn`, { token })
    }
}