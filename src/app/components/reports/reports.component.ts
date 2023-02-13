import { Component } from "@angular/core";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { ReportsEarnedPointsComponent } from './earned-points/reports.earned.points.component';
import { ReportsRedeemedPointsComponent } from './redeemed-points/reports.redeemed.points.component';
import { ReportClearedPointsComponent } from './cleared-points/reports.cleared.points.component';
import { IGenerateReportBody, ReportsServices } from "./reports.service";
import * as moment from "moment";
import { ReportVoidedPointsComponent } from "./voided-points/reports.voided.points.component";
import { ReportFrequencyEarnedPointsComponent } from "./frequency-earned-points/reports.frequency.earnedpoints.component";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})

export class ReportsComponent {

    constructor(
        public helperServices: HelperServices,
        public reporstServices: ReportsServices
    ) { }

    /** @States */
    title: string = "Reports"
    reports: string[] = [
        "Earned-Points",
        "Redeemed-Points",
        "Cleared-Points",
        "Voided-Points-Store",
        "Frequency-Earned-Points",
    ]
    
    componentRender: any;
    selectedCategories: string[] = [];
    basedDateRanges: string[] = []
    
    /** @Earned_Points */
    isGenerating: boolean = false
    earnedPointsCategory: string[] = ["Synched", "Uploaded"]
    earnedPointsStatus: string[] = ["Not Cleared", "Cleared"]
    selectedStatus: string[] = []
    selectedDateRanged: any;

    ngOnInit(): void {
        this.reporstServices.selectedReport = "";
    }

    /** @Validations */
    validateBeforeGenerate() {
        if (this.reporstServices.selectedReport && this.reporstServices.range.value.start && this.reporstServices.range.value.end && this.selectedDateRanged) return true
        if (this.reporstServices.selectedReport == "Cleared-Points" && this.reporstServices.range.value.start && this.reporstServices.range.value.end) return true;
        if (this.reporstServices.selectedReport == "Voided-Points-Store" && this.reporstServices.range.value.start && this.reporstServices.range.value.end) return true;
        if (this.reporstServices.selectedReport == "Frequency-Earned-Points" && this.reporstServices.range.value.start && this.reporstServices.range.value.end) return true;
        return false;
    }

    validateDateRangedBased() {
        if (this.reporstServices.selectedReport == "Earned-Points" || this.reporstServices.selectedReport == "Redeemed-Points") {
            return true
        }
        return false;
    }

    /** @Methods */
    setBasedDateRange() {
        this.reporstServices.selectedBasedDateRange = "";
        this.componentRender = null;
        this.reporstServices.range.patchValue({ start: "", end: "" })
        this.selectedDateRanged = ""
        this.selectedCategories = []
        this.selectedStatus = []
        if (this.reporstServices.selectedReport == "Earned-Points") this.basedDateRanges = ["Date Synched / Upload", "Date Earned", "Date Cleared Points"]
        if (this.reporstServices.selectedReport == "Redeemed-Points") this.basedDateRanges = ["Date Synched", "Date Redeemed"]
        if (this.reporstServices.selectedReport == "Cleared-Points") this.basedDateRanges = ["Date Cleared"]
    }

    generate() {
        this.isGenerating = true;
        this.reporstServices.range.disable()
        this.componentRender =""
        this.reporstServices.selectedBasedDateRange = this.selectedDateRanged
        this.reporstServices.selectedDateRange = {
            start: this.reporstServices.range.value.start,
            end: this.reporstServices.range.value.end,
        }

        const reportBodyRequest: IGenerateReportBody = {
            selectedReport: this.reporstServices.selectedReport,
            dateRangedBased: this.selectedDateRanged,
            dateRanged: {
                start: moment(this.reporstServices.range.value.start).format("yyyy-MM-DD"),
                end: moment(this.reporstServices.range.value.end).format("yyyy-MM-DD"),
            },
            category: this.selectedCategories,
            status: this.selectedStatus
        }

        this.reporstServices.generateReport(reportBodyRequest).subscribe(res => {
            this.isGenerating = false;
            this.reporstServices.range.enable()
            if(this.reporstServices.selectedReport == "Earned-Points") {
                this.reporstServices.earnedPointsReportDataSource.data = res.map((earnedPoints: any) => {
                    return {
                        id: earnedPoints.id,
                        store_name: earnedPoints.store_name,
                        transaction_no: earnedPoints.transaction_no,
                        category: earnedPoints.category,
                        first_name: earnedPoints.first_name,
                        last_name: earnedPoints.last_name,
                        mobile_number: earnedPoints.mobile_number,
                        amount: earnedPoints.amount,
                        points_earn: earnedPoints.points_earn,
                        status: earnedPoints.status,
                        transaction_datetime: moment(earnedPoints.transaction_datetime).format("MMMM DD, yyyy hh:mm:ss a"),
                        created_at: moment(earnedPoints.created_at).format("MMMM DD, yyyy hh:mm:ss a"),
                        cleared_datetime: moment(earnedPoints.cleared_datetime).format("MMMM DD, yyyy hh:mm:ss a"),
                        void_status: earnedPoints.void_status,
                        voided_at: earnedPoints.voided_at != null ? moment(earnedPoints.voided_at).format("MMMM DD, yyyy hh:mm:ss a") : null,
                    }
                })
                this.componentRender = ReportsEarnedPointsComponent;
            }

            if(this.reporstServices.selectedReport == "Redeemed-Points") {
                this.reporstServices.redeemedPointsReportDataSource.data = res.map((redeemedPoints: any) => {
                    return {
                        id: redeemedPoints.id,
                        mobile_number: redeemedPoints.mobile_number,
                        first_name: redeemedPoints.first_name,
                        last_name: redeemedPoints.last_name,
                        name: redeemedPoints.name,
                        points_redeemed: redeemedPoints.points_redeemed,
                        reference_no: redeemedPoints.reference_no,
                        created_at: moment(redeemedPoints.created_at).format("MMMM DD, yyyy hh:mm:ss a"),
                        void_status: redeemedPoints.void_status,
                        voided_at: redeemedPoints.voided_at != null ? moment(redeemedPoints.voided_at).format("MMMM DD, yyyy hh:mm:ss a") : null
                    }
                });
                this.componentRender = ReportsRedeemedPointsComponent;
            }
            if(this.reporstServices.selectedReport == "Cleared-Points") {
                this.reporstServices.clearedPointsReportDataSource.data = res;
                this.componentRender = ReportClearedPointsComponent;
            }
            if(this.reporstServices.selectedReport == "Voided-Points-Store") {
                this.reporstServices.voidedPointsReportDataSource.data = res.map((voidedPoints:any) => {
                    return {
                        id: voidedPoints.id,
                        store_name: voidedPoints.store_name,
                        transaction_datetime: moment(voidedPoints.transaction_datetime).format("MMMM DD, yyyy hh:mm:ss a"),
                        transaction_no: voidedPoints.transaction_no,
                        mobile_number: voidedPoints.mobile_number,
                        first_name: voidedPoints.first_name,
                        last_name: voidedPoints.last_name,
                        amount: voidedPoints.amount,
                        points_earn: voidedPoints.points_earn,
                        voided_at: moment(voidedPoints.voided_at).format("MMMM DD, yyyy hh:mm:ss a"),
                        created_at: moment(voidedPoints.created_at).format("MMMM DD, yyyy hh:mm:ss a"),
                    }
                });
                this.componentRender = ReportVoidedPointsComponent;
            }

            if(this.reporstServices.selectedReport == "Frequency-Earned-Points") {
                this.reporstServices.frequencyEarnedPointsReportDataSource.data = res.map((frequency:any) => {
                    return {
                        mobile_number: frequency.mobile_number,
                        first_name: frequency.first_name,
                        last_name: frequency.last_name,
                        count: frequency.count,   
                    }
                });
                this.componentRender = ReportFrequencyEarnedPointsComponent;
            }
        })

       
    }

}