import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class UpdateFileService {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}

    updateFile(updateFile: any): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/UpdateFile2`, updateFile)
        return this.http.post(`${this.credServices.port}/admin/UpdateFile`, updateFile)
    }

    placeHolder(id: number): Observable<any> {
        return this.http.get("https://jsonplaceholder.typicode.com/posts/"+ id)
    }


    updateClientFile(updateFile: any): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/reports/update-file`, updateFile)
    }

    moveUpdateFile(fileName: string): Observable<any> {
        return this.http.post(`${this.credServices.clientPort}/reports/move-file`, {fileName})
    }

    createFolder() : Observable<any>{
        return this.http.post(`${this.credServices.clientPort}/reports/create-folder`, {})
    }
}