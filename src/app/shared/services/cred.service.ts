import { Injectable } from "@angular/core";
import { LocalService } from "./local.service";

@Injectable({
    providedIn: "root"
})

export class CredServices {
    constructor(
        private localService: LocalService
    ) { }
    port: string = "http://127.0.0.1:8000/api";
    //  port: string = "https://pretestbeta.rdfmis.ph/server/api";
    // port: string = "https://freshoptionsrewards.com/server/api";
    // port: string = "http://8f4d-110-54-129-24.ngrok.io/api"
    clientPort: string = "http://localhost:5000/api";
    secretKey: string = "secret key 123";

    getCredentials(): { token: string, user: ICredentials, client_user: any, client_token: string, activated_store: any } {
        return {
            token: this.localService.getJsonValue("token"),
            user: this.localService.getJsonValue("user"),
            client_user: this.localService.getJsonValue("client-user"),
            client_token: this.localService.getJsonValue("client-token"),
            activated_store: this.localService.getJsonValue("store-activated")
        }
    }
}


interface ICredentials {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    access_permission: any
}