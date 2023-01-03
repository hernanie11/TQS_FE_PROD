import { NgxMatFileInputModule } from "@angular-material-components/file-input";
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
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { ClearedPointsDialogComponent } from "./dialog/cleared.points.dialog.component";
import { ClearedPointsTableComponent } from "./table/cleared.points.table.component";

const maskConfig: Partial<IConfig> = {
    validation: false,
  };

  
const routes: Routes = [
    { path: '', component: ClearedPointsTableComponent },
]

@NgModule({
    declarations: [
        ClearedPointsTableComponent,
        ClearedPointsDialogComponent
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
        MatButtonModule,
        MatDialogModule,
        NgxMaskModule.forRoot(maskConfig),
        MatProgressBarModule,
        ReactiveFormsModule,
        NgxMatFileInputModule
    ]
})

export class ClearedPointsModule {

}