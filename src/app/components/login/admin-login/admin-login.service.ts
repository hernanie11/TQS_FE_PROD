import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CredServices } from "src/app/shared/services/cred.service";
import { retry, timeout } from 'rxjs/operators';
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class AdminLoginServices {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    authenticate(loginForm: {username: string, password: string}): Observable<any> {
        return this.http.post<any>(`${this.credServices.port}/login`, loginForm, { observe: 'response'}).pipe(
            timeout(10000),
        )
    }
}

export interface IAuthenticateResponse {
    data?: {
        access: string;
        token: string;
        user: any;
    };
    isAuthenticated: boolean;
    message: string;
}