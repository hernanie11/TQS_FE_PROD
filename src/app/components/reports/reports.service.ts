import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { CredServices } from "src/app/shared/services/cred.service";

@Injectable({
    providedIn: "root"
})

export class ReportsServices {

    constructor(
        private http: HttpClient,
        private credServices: CredServices
    ) {}
    
    selectedReport: "" | "Earned-Points" | "Redeemed-Points" | "Cleared-Points" | "Voided-Points-Store" | "Frequency-Earned-Points";
    selectedBasedDateRange: string;
    selectedDateRange: any;

    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    earnedPointsReportDataSource = new MatTableDataSource<any>()
    redeemedPointsReportDataSource = new MatTableDataSource<any>()
    clearedPointsReportDataSource = new MatTableDataSource<any>()
    voidedPointsReportDataSource = new MatTableDataSource<any>()
    frequencyEarnedPointsReportDataSource = new MatTableDataSource<any>()


    generateReport(requestBody: IGenerateReportBody): Observable<any> {
        return this.http.post(`${this.credServices.port}/admin/report`, requestBody)
    }

}

export interface IGenerateReportBody {
    selectedReport: string;
    dateRangedBased: string;
    dateRanged: any;
    category: string[];
    status: string[]
}