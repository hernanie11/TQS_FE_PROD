import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class TransactionPointsService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getEarnedPoints(): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/earn/pending`)
    }

    getSynchedEarnedPoints(options: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/earn/synched`, options, { observe: 'response'})
    }

    sync(updateFile: any, store_id: number) {
        return this.http.post(`${this.credServices.port}/updatefile-sync/${store_id}`, updateFile, { observe: 'response'})
    }

    void(earnedId: any, void_by: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/earn/void/${earnedId}`, { void_by }, { observe: 'response' })
    }

    removeVoid(): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/earn/remove-void`, {}, {observe: 'response'})
    }

    getRedeemedPoints(options: any): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/redeemed/paginate?searchValue=${options.searchValue}&currentPage=${options.currentPage}&itemsPerPage=${options.itemsPerPage}`, { observe: 'response'})
    }


    getVoidedEarnedPoints(showAll: boolean): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/earn/voided?showAll=${showAll}`, { observe: 'response'})
    }

    syncStoreVoided(voidedEarnedPoints: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/voidedpoints-store-sync`, voidedEarnedPoints)
    }

    updateStoreVoidStatus(earnedPointsObjectIds: any[]): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/earn/sync-void`, {earnedPointsObjectIds})
    }
}