import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { RouterModule, Routes } from "@angular/router";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { DirectivesModule } from "src/app/directives/directives.module";
import { AddressComponent } from "./address/address.component";
import { BirthdayComponent } from "./birthday/birthday.component";
import { CookingComponent } from "./cooking/cooking.component";
import { EmailComponent } from "./email/email.component";
import { GenderComponent } from "./gender/gender.component";
import { MembersRegisterComponent } from "./members.register.component";
import { MobileNumberComponent } from "./mobile-number/mobile.number.component";
import { NameComponent } from "./name/name.component";
import { OverviewComponent } from "./overview/overview.component";
import { WorkingComponent } from "./working/working.component";

const routes: Routes = [
    { path: '', component: MembersRegisterComponent }
]
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [
        MembersRegisterComponent,
        MobileNumberComponent,
        NameComponent,
        GenderComponent,
        BirthdayComponent,
        AddressComponent,
        WorkingComponent,
        CookingComponent,
        OverviewComponent,
        EmailComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DirectivesModule,
        NgxMaskModule.forRoot(maskConfig),
        MatSnackBarModule,
        MatDialogModule,
        NgxMatSelectSearchModule,
        MatSelectModule
    ]
})

export class MembersRegisterModule {

}