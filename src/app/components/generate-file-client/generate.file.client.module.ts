import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import { GenerateFileClientComponent } from "./generate.file.client.component";

const routes: Routes = [
    { path: '', component: GenerateFileClientComponent }
]

@NgModule({
    declarations: [
        GenerateFileClientComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        CommonModule,
        FormsModule
    ]
})

export class GenerateFileClientModule {

}