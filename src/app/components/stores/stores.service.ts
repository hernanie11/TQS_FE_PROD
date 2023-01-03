import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class StoresServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getStoresWithPaginator(searchvalue: string, currentPage: number, storePerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/store/search/${storePerPage}?page=${currentPage}`, { searchvalue }, { observe: 'response' }).pipe(timeout(10000)
        )
    }

    createStore(storeForm: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/create-store`, storeForm, { observe: 'response' })
    }

    getStoreById(storeId: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/store/getstorebyid/${storeId}`)
    }

    updateStoreById(storeId: number, storeForm: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/update-store/${storeId}`, storeForm)
    }

    updateStoreStatus(userId: number, is_active: boolean): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/update-store-status/${userId}`, { is_active }, { observe: 'response' })
    }

    getTokensByStoreId(storeId: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/store/getstoretokens/${storeId}`, { observe: 'response' })
    }

    generateNewToken(store_id: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/store/add-token`, { store_id }, { observe: 'response' })
    }

    removeToken(tokenId: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/store/store_token/${tokenId}`, { observe: 'response' })
    }



}

export type storeCodePlaceHolder = "Loading..." | "Find Store Code..." | "No Store Code Found";
export type areaPlaceHolder = "Loading..." | "Find Area..." | "No Area Found";
export type clusterPlaceHolder = "Loading..." | "Find Cluster..." | "No Cluster Found"
export type businessModelPlaceHolder = "Loading..." | "Find Business Model" | "No Business Model Found"
export type regionPlaceHolder = "Loading..." | "Find Region" | "No Region Found"