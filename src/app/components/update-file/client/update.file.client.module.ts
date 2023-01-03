import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule, Routes } from "@angular/router";
import { UpdateFileClientComponent } from "./update.file.client.component";

const routes: Routes = [
    { path: '', component: UpdateFileClientComponent }
]

@NgModule({
    declarations: [
        UpdateFileClientComponent
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
        MatSnackBarModule
    ]
})

export class UpdateFileClientModule {

}