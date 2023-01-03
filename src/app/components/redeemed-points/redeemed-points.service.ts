import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: `root`
})

export class RedeemedPointsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    populateDummyRedeemedPoints(): Observable<any> {
        return this.http.get("../../../assets/json/redeemed-points.json")
    }

    populateRedeemedPoints(currentPage: number, redeemedPointsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/redeem/${redeemedPointsPerPage}/?page=${currentPage}`)
    }

    searchRedeemedPoints(searchvalue: string, currentPage: number, redeemedPointsPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/search-redeem/${redeemedPointsPerPage}?page=${currentPage}`, { searchvalue })
    }

    void(redeemedId: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/redeemedpoints/void/${redeemedId}`, { observe: 'response' })
    }

 
}