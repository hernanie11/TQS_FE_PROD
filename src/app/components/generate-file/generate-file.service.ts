import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class GenerateFileServices {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    generateDatabase(): Observable<any> {
        return this.http.get("../../../assets/json/updated-database.json")
    }

    generateFile(selectedReports: {user_account: boolean, member: boolean, store: boolean}): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/generate/generatefile`, selectedReports)
    }
}