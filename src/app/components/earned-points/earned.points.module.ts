import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { DirectivesModule } from "src/app/directives/directives.module";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { EarnedPointsDialogComponent } from "./dialog/earned.points.dialog.component";
import { EarnedPointsTableComponent } from "./table/earned.points.table.component";

const routes: Routes = [
    { path: '', component: EarnedPointsTableComponent }
]

@NgModule({
    declarations: [
        EarnedPointsTableComponent,
        EarnedPointsDialogComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        MatPaginatorModule,
        MatTableModule,
        MatMenuModule,
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatSelectModule,
        MatDatepickerModule,
        DirectivesModule,
        NgxMatFileInputModule,
        MatCheckboxModule,
        MatSnackBarModule
    ]
})

export class EarnedPointsModule {

}