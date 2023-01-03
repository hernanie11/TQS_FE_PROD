import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";

@Injectable({
    providedIn: "root"
})

export class AreasServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getAreasNoPaginator(): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/storemodulearea`, { observe: 'response' })
    }

    getAreas(searchvalue: string, currentPage: number, areaperpage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulearea/search/${areaperpage}?page=${currentPage}`, { searchvalue }, { observe: 'response' })
    }

    createArea(area: string): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulearea`, { area }, { observe: 'response' })
    }

    updateArea(id: number, area: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/storemodulearea/${id}`, { area }, { observe: 'response' })
    }

    deleteArea(id: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/storemodulearea/${id}`, { observe: 'response' })
    }
}