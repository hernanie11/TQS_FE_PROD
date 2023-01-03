import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class AddressService {
    constructor(
        private http: HttpClient,
        private handler: HttpBackend, 
    ) {
        this.http = new HttpClient(handler);
    }

    // getAddresses(): Observable<any> {
    //     return this.http.get('../../../assets/json/addresses.json')
    // }

    getAddresses(): Observable<any> {
        const tokenType = 'Bearer';
        const token = "9|u27KMjj3ogv0hUR8MMskyNmhDJ9Q8IwUJRg8KAZ4";
        const header = new HttpHeaders().set('Authorization', `${tokenType} ${token}`)
        const headers = { headers: header };
        
        return this.http.get('https://rdfsedar.com/api/data/address/fetchaddress', headers)
    }
}