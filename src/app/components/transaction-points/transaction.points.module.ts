import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { TransactionPointsComponent } from "./transaction.points.component";
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import {MatBadgeModule} from '@angular/material/badge';
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TransactionPointsDialogComponent } from "./dialog/transaction.points.dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
const routes: Routes = [
    { path: '', component: TransactionPointsComponent}
]

@NgModule({
    declarations: [
        TransactionPointsComponent,
        TransactionPointsDialogComponent
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
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatTooltipModule,
        MatCheckboxModule
    ]
})

export class TransactionPointModule {

}