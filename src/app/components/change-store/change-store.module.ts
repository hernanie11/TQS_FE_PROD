import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ChangeStoreComponent } from "./change-store.component";

@NgModule({
    declarations: [
        ChangeStoreComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        NgxMatSelectSearchModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        CommonModule,
        MatIconModule,
        MatInputModule
    ]
})
export class ChangeStoreModule {

}