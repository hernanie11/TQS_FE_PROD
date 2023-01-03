import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule, Routes } from "@angular/router";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { DirectivesModule } from "src/app/directives/directives.module";
import { EarnPointsComponent } from "./earn.component";

const routes: Routes = [
    { path: '', component: EarnPointsComponent }
]
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [
        EarnPointsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        DirectivesModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(maskConfig),
        MatSnackBarModule, 
        MatDialogModule
    ]
})

export class EarnModule { }