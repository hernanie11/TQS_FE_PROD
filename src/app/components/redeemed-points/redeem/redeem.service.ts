import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class RedeemService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    validateMobileNumber(form: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/validate-mobilenumber`, form)
    }

    redeem(form: any, token: string): Observable<any> {
        const tokenType = 'Bearer';
        const header = new HttpHeaders().set('Authorization', `${tokenType} ${token}`)
        const headers = { headers: header };
        return this.http.post(`${this.credServices.port}/redeem-request`, form)
    }

    saveRedeemInLocalStorage(redeemedPoints: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/redeemed`, redeemedPoints)
    }
    getMemberByMysqlId(mobile_number: any): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/members/get-member-by-mobile-number?mobile_number=${mobile_number}`)
    }
}