import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class EarnedPointsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getEarnedPointsWithPaginator(currentPage: number, pointsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/earnedpoints/${pointsPerPage}/?page=${currentPage}`).pipe(
            timeout(10000)
        )
    }

    searchEarnedPoints(searchvalue: string, currentPage: number, earnedPointsPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/search-earnedpoints/${earnedPointsPerPage}?page=${currentPage}`, { searchvalue })
    }

    validateEarnedPoints(earnedPoints: any[]): Observable<{errors?: any, message?: any}> {
        return this.http.post<{errors?: any, message?: any}>(`${this.credServices.port}/admin/points/check`, earnedPoints)
    }

    uploadEarnedPoints(earnedPoints: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/points/import`, earnedPoints)
    }

    addToClearedPoints(earnedPoints: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/points/cleared-points`, earnedPoints)
    }

    earnPoints(): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}`, {})
    }

    void(earnedPointId: number) : Observable<any>{
        return this.http.delete(`${this.credServices.port}/admin/points/cleared/void/${earnedPointId}`, { observe: 'response' })
    }
}


