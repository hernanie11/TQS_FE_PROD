import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, retry, timeout } from "rxjs/operators";
import { CredServices } from "./cred.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private credServices: CredServices,
        private http: HttpClient
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let { token } = this.credServices.getCredentials()
        if (token) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token)
            });
            return next.handle(cloned);
        }
        else {
            return next.handle(req).pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError(error)
                }),
                finalize(() => {
                    const profilingMsg = `${req.method} ${req.urlWithParams}`
                })
            )
        }
    }

}