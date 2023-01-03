import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule, Routes } from "@angular/router";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { DirectivesModule } from "src/app/directives/directives.module";
import { RedeemComponent } from "./redeem.component";

const routes: Routes = [
    { path: '', component: RedeemComponent }
]
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [
        RedeemComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(maskConfig),
        DirectivesModule,
        MatIconModule,
        MatSnackBarModule,
        MatButtonModule,
        CommonModule,
        MatDialogModule,
        FormsModule,
        ClipboardModule,
        MatProgressBarModule
    ]
})

export class RedeemModule {
    
}