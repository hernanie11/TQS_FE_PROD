import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { IsStoreActivated } from "src/app/guards/is.store.activated.guard";
import { GettingStartedComponent } from "./getting-started/getting.started.component";
import { InstallationComponent } from "./installation/installation.component";
import {MatStepperModule} from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import {MatProgressBarModule} from '@angular/material/progress-bar';
const routes: Routes = [
    { path: 'getting-started', canActivate: [IsStoreActivated], component: GettingStartedComponent },
    { path: 'installation', canActivate: [IsStoreActivated], component: InstallationComponent}
]

@NgModule({
    declarations: [
        GettingStartedComponent,
        InstallationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        ReactiveFormsModule,
        CommonModule,
        MatSelectModule,
        MatSnackBarModule,
        MatIconModule,
        NgxMatFileInputModule,
        MatProgressBarModule,
    ]
})

export class PortalModule {

}