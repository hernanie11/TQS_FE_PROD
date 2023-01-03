import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
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
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DirectivesModule } from "src/app/directives/directives.module";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { BusinessModelComponent } from "./business.model.component";
import { BusinessModelDialogComponent } from "./dialog/business.model.dialog.component";

const routes: Routes = [
    { path: '', component: BusinessModelComponent}
]

@NgModule({
    declarations: [
        BusinessModelComponent,
        BusinessModelDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        MatPaginatorModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSelectModule,
        ReactiveFormsModule,
        DirectivesModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        ClipboardModule,
        NgxSkeletonLoaderModule,
        CommonModule
    ]
})

export class BusinessModelModule {

}