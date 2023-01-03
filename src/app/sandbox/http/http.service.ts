import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})

export class HttpService {
    constructor(
        private http: HttpClient
    ) {}

    getById(id: number) : Observable<any> {
        return this.http.get(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(delay(2000))
    }
    
}