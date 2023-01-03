import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule, Routes } from "@angular/router";
import { IsStoreActivated } from "src/app/guards/is.store.activated.guard";
import { ClientLoginComponent } from "./client.login.component";

const routes: Routes = [
    { path: '', canActivate: [IsStoreActivated], component: ClientLoginComponent }
];

@NgModule({
    declarations: [ClientLoginComponent],
    imports: [
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        CommonModule
    ],
})

export class ClientLoginModule {

}