import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class StoreCodesServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getStatusCodesNoPaginate(action: string): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulestorecode/${action}`, {}, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    getStores(searchvalue?: string, currentPage?: number, storecodeperpage?: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulestorecode/search/${storecodeperpage}?page=${currentPage}`, { searchvalue }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    createStoreCode(store_code: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulestorecode`, { store_code }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    updateStoreCode(store_code_id: number, store_code: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/storemodulestorecode/${store_code_id}`, { store_code }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    deleteStoreCode(store_code_id: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/storemodulestorecode/${store_code_id}`, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }
}