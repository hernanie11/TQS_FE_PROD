import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { ChangeStoreModule } from "src/app/components/change-store/change-store.module";
import { SharedLayoutsModule } from "src/app/shared/layouts/shared.layouts.module";
import { ClientHeaderComponent } from "./header/client.header.component";
import { LayoutClientComponent } from "./layout.client.component";
import { ClientSidebarComponent } from "./sidebar/client.sidebar.component";

const routes: Routes = [
    { 
        path: '', component: LayoutClientComponent,
        children: [
            { path: 'transactions', loadChildren: () => import("../../components/transactions/transactions.module").then(m => m.TransactionsModule) }
        ]
    }
]

@NgModule({
    declarations: [
        LayoutClientComponent,
        ClientHeaderComponent,
        ClientSidebarComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedLayoutsModule,
        MatSidenavModule,
        FormsModule,
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatListModule,
        ChangeStoreModule
    ]
})

export class LayoutClientModule {

}