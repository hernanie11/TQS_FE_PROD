import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { UpdateFileAdminComponent } from "./update.file.admin.component";
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
const routes: Routes = [
    { path: '', component: UpdateFileAdminComponent }
]

@NgModule({
    declarations: [
        UpdateFileAdminComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgxMatFileInputModule,
        MatProgressBarModule,
        CommonModule,
        MatTableModule
    ]
})

export class UpdateFileAdminModule {

}