import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ClearedPointsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    getClearedPointsWithPaginator(searchvalue: string, currentPage: number, clearedPointsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/cleared-points?limit=${clearedPointsPerPage}&searchvalue=${searchvalue}&page=${currentPage}`).pipe(
            timeout(10000)
        )
    }

    searchClearedPoints(searchvalue: string, currentPage: number, clearedPointsPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/search-cleared-points/${clearedPointsPerPage}?page=${currentPage}`, { searchvalue })
    }

    viewSoa(member_id: number, currentPage: number, itemsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/generate_soa/${member_id}`, { observe : 'response' })
    }

    importClearedPoints(clearedPoints: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/cleared-points/import`, clearedPoints, { observe: 'response' })
    }
}