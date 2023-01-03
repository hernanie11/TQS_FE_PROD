import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "../../services/cred.service";

@Injectable({
    providedIn: "root"
})

export class HeaderServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    logOut(): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/logout`, { })
    }
}