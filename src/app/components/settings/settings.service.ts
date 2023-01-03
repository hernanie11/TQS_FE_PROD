import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";
const ipLocation = require("iplocation")
@Injectable({
    providedIn: "root"
})

export class SettingsServices {
    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) { }
    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resp => {
                console.log(resp);
                resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
            },
                err => {
                    reject(err);
                })
        })
    }
    
    getEarningPointsPercentage(): Observable<any> {
        return this.http.get(`${this.credServices.port}/admin/get-setting`)
    }

    updateEarningPointsPercentage(set_percentage: any, remarks: any): Observable<any> {
        return this.http.put(`${this.credServices.port}/admin/setting`, { set_percentage, remarks })
    }





}