import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class InstallationServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getStores(): Observable<any> {
        return this.http.get(`${this.credServices.port}/stores`)
    }

    validateToken(bodyParams: { store_id: number; token: string }): Observable<any> {
        return this.http.post(`${this.credServices.port}/validate-store`, bodyParams).pipe(timeout(10000))
    }

    createStore(store: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/stores`, store)
    }

    createMember(member: IMember): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/members`, member)
    }

    createUser(user: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/users`, user)
    }

    activateStore(activateStore: IActivateStoreBody): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/store-activate`, activateStore)
    }

    createEarningPointsPercentage(settings: {setting_mysql_id: number, earning_percentage: number}): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/settings`, settings)
    }

    activateStoreInAdmin(token: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/activate-store`, {token}, { observe: 'response' })
    }

    installInitialDatabse(data: any) {
        return this.http.post(`${this.credServices.clientPort}/store-activate/upload-initial-database`, data, { observe: 'events', reportProgress: true })
    }

    createStoreNotFound(store: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}`, store)
    }
}

export interface IStore {
    id?: number;
    businesscategory_id?: number;
    store_mysql_id: number;
    business_category_id: number;
    code: string;
    name: string;
    area: string;
    region: string;
    cluster: string;
    business_model: string;
    token: string;
}
export interface IMember {
    id?: number;
    member_mysql_id: number;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    email: string;
    barangay: string;
    municipality: string;
    province: string;
    mobile_number: string;
}
export interface IUser {
    id?: number;
    user_mysql_id: number;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
}
export interface IActivateStoreBody {
    store_mysql_id: string;
    token: string;
    activated_date: string
}