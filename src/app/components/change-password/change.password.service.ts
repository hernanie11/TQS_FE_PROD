import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ChangePasswordService {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    validateAdminPassword(payload: any) {
        return this.http.post(`${this.credServices.port}/admin/accounts/validate-password`, payload)
    }

    updateNewPassword(payload: any) {
        return this.http.post(`${this.credServices.port}/admin/accounts/change-password`, payload)
    }


    validateClientPassword(payload: any) {
        return this.http.post(`${this.credServices.clientPort}/auth/validate-password`, payload)
    }

    updatePasswordClient(payload: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/auth/update-password`, payload)
    }
}
