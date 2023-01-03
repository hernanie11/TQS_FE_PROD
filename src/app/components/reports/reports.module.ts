import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { ReportsComponent } from "./reports.component";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ReportsEarnedPointsComponent } from "./earned-points/reports.earned.points.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDividerModule } from "@angular/material/divider";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ReportsRedeemedPointsComponent } from "./redeemed-points/reports.redeemed.points.component";
import { ReportClearedPointsComponent } from "./cleared-points/reports.cleared.points.component";
import { ReportVoidedPointsComponent } from "./voided-points/reports.voided.points.component";
import { ReportFrequencyEarnedPointsComponent } from "./frequency-earned-points/reports.frequency.earnedpoints.component";


const routes: Routes = [
    { path: '', component: ReportsComponent }
]

@NgModule({
    declarations: [
        ReportsComponent,
        ReportsEarnedPointsComponent,
        ReportsRedeemedPointsComponent,
        ReportClearedPointsComponent,
        ReportVoidedPointsComponent,
        ReportFrequencyEarnedPointsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        CommonModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        ClipboardModule,
        MatSnackBarModule,
        
    ]
})

export class ReportsModule {

}