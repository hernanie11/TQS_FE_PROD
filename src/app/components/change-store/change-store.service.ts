import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ChangeStoreService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    updateStoreActivate(newStore: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/store-activate/update-store-activated`, newStore)
    }

    checkStoreExists(store_mysql_id: number): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/stores/check-store-exist?store_mysql_id=${store_mysql_id}`)
    }
    
    createNewStore(newstore: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/stores`, newstore)
    }
}