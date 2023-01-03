import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class BusinessModelServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getBusinessModelNoPaginator(): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/storemodulebusiness_category`, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    getBusinessModels(searchvalue: string, currentPage: number, businessModelPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulebusiness_category/search/${businessModelPerPage}?page=${currentPage}`, { searchvalue }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    createBusinessModel(business_category: string): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulebusiness_category`, {business_category}, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    updateBusinessModel(businessCategoryId: number, business_category: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/storemodulebusiness_category/${businessCategoryId}`, { business_category }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    deleteBusinessModel(businessCategoryId: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/storemodulebusiness_category/${businessCategoryId}`, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }
}