import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class RegionService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getRegionNoPaginator(): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/storemoduleregion`, { observe: 'response' })
    }

    getRegions(searchvalue: string, currentPage: number, itemPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemoduleregion/search/${itemPerPage}?page=${currentPage}`, { searchvalue }, { observe: 'response' })
    }

    createRegion(region: string): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemoduleregion`, { region }, { observe: 'response' })
    }

    updateRegion(regionId: number, region: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/storemoduleregion/${regionId}`, { region }, { observe: 'response' })
    }

    deleteRegion(regionId: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/storemoduleregion/${regionId}`, { observe: 'response' })
    }
}