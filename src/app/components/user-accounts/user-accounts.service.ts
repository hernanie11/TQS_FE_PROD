import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { TextError } from "src/app/interfaces/errors";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class UserAccountsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }

    updatedUserAccounts: {
        id: number;
        changed?: {
            first_name?: boolean;
            last_name?: boolean;
            username?: boolean;
            is_active?: boolean;
        }
    }[] = [
            { id: 31, changed: { is_active: true } }
        ]

    getUserAccountsWithPaginator(currentPage: number, userAccountsPerPage: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/accounts/${userAccountsPerPage}/?page=${currentPage}`, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    searchUserAccount(searchvalue: string, currentPage: number, userAccountPerPage: number): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/accounts/search/${userAccountPerPage}?page=${currentPage}`, { searchvalue }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    createUserAccount(userAccountObject: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/accounts/create`, userAccountObject, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    getUserAccountById(userId: number): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/accounts/getuserbyid/${userId}`, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    updateUserAccountById(userId: number, updatedUserAccount: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/accounts/update-account/${userId}`, updatedUserAccount, {observe: 'response'}).pipe(
            timeout(10000)
        )
    }

    deactivateUserAccountById(userId: number, action: string): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/accounts/update-account-status/${userId}`, { action }, { observe: 'response' }).pipe(
            timeout(10000)
        )
    }

    resetPassword(userId: number): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/accounts/reset-password/${userId}`, {}, {observe: 'response'}).pipe(
            timeout(10000)
        )
    }
}