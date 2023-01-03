import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ClusterServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getClustersNoPaginator(): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/storemodulecluster`, { observe: 'response' })
    }

    getClusters(searchvalue: string, currentPage: number, clusterPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulecluster/search/${clusterPerPage}?page=${currentPage}`, { searchvalue }, { observe: 'response' })
    }

    createCluster(cluster: string): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/storemodulecluster`, { cluster }, { observe: 'response' })
    }

    updateCluster(clusterId: number, cluster: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/storemodulecluster/${clusterId}`, { cluster }, { observe: 'response' })
    }

    deleteCluster(clusterId: number): Observable<any> {
        return this.http.delete(`${this.credServices.port}/admin/storemodulecluster/${clusterId}`, { observe: 'response' })
    }
}