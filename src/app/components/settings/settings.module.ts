import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { AdminContainerModule } from "src/app/layouts/admin-container/admin.container.module";
import { SettingsComponent } from "./settings.component";
import {MatExpansionModule} from '@angular/material/expansion';
import { SettingsDialogComponent } from "./dialog/settings.dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DirectivesModule } from "src/app/directives/directives.module";
const routes: Routes = [
    { path: '', component: SettingsComponent}
]

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AdminContainerModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        CommonModule,
        MatExpansionModule,
        MatDialogModule,
        MatSnackBarModule,
        DirectivesModule
    ]
})

export class SettingsModule {

}