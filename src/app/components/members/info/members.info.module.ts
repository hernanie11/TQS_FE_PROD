import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule, Routes } from "@angular/router";
import { MembersInfoComponent } from "./members.info.component";

const routes: Routes = [
    { path: '', component: MembersInfoComponent}
]

@NgModule({
    declarations: [
        MembersInfoComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatTabsModule,
        CommonModule,
        FormsModule,
        MatPaginatorModule,
        MatTableModule,
        MatBadgeModule,
        MatMenuModule
    ]
})

export class MembersInfoModule {

}