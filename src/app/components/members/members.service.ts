import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { delay, timeout } from "rxjs/operators";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class MembersServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    getMembersWithPaginator(searchvalue: string, currentPage: number, memberPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/search-member/${memberPerPage}?page=${currentPage}`, { searchvalue }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }


    createMember(memberForm: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/create-member`, memberForm, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    getMemberbyID(memberId: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/member/getmemberbyid/${memberId}`, { observe: 'response' })
    }

    updateMemberbyId(memberId: number, memberForm: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/update-member/${memberId}`, memberForm, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    updateStatusById(memberId: number, is_active: boolean): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/update-member-status/${memberId}`, { is_active }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    importMembers(importMemberForm: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/member/import-members`, importMemberForm, { reportProgress: true, observe: 'events',  })
    }

    validateMembers(importMemberForm: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/member/check-members`, importMemberForm)
    }

    populateStores(): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/get_all_stores`, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    getMembersInClient( searchValue: string, currentPage: number, itemsPerPage: number ): Observable<any> {
        return this.http.get(`${this.credServices.clientPort}/members/with-paginator?searchValue=${searchValue}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { observe: 'response', reportProgress: true}).pipe(
            timeout(10000)
        )
    }
}

export type storesPlaceHolder = "Loading..." | "Find Store..." | "No Store Found"