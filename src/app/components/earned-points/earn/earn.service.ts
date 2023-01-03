import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class EarnService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getUpdatedEarningPointsPercentage(): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/settings/updated/earning/percentage`)
    }

    validateMobileNumber(mobile_number: string): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/earn/validate/mobile-number`, { mobile_number })
    }

    earnPoints(earnForm: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/earn`, earnForm)
    }
}