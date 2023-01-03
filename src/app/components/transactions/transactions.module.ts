import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MembersRegisterComponent } from "../members/register/members.register.component";
import { ClientAccessPermissionGuard } from "./guards/access.permission.guard";
import { TransactionsComponent } from "./transactions.component";
import { TransactionsGuard } from "./transactions.guard";
import { UnAuthorizedStoreComponent } from "./unauthorized/unauthorized.store.component";

const routes: Routes = [
    { path: '', component: TransactionsComponent },
    { path: 'register-customer', canActivate: [ClientAccessPermissionGuard], loadChildren: () => import("../members/register/members.register.module").then(m => m.MembersRegisterModule) },
    { path: 'earn-points', canActivate: [ClientAccessPermissionGuard], loadChildren: () => import("../earned-points/earn/earn.module").then(m => m.EarnModule) },
    { path: 'redeem-points', canActivate: [TransactionsGuard, ClientAccessPermissionGuard], loadChildren: () => import("../redeemed-points/redeem/redeem.module").then(m => m.RedeemModule) },
    { path: 'transaction-points', canActivate: [ClientAccessPermissionGuard], loadChildren: () => import("../transaction-points/transaction.points.module").then(m => m.TransactionPointModule) },
    { path: 'customer-info', canActivate: [ClientAccessPermissionGuard], loadChildren: () => import("../members/info/members.info.module").then(m => m.MembersInfoModule) },
    { path: 'generate-file', canActivate: [ClientAccessPermissionGuard], loadChildren: () => import("../generate-file-client/generate.file.client.module").then(m => m.GenerateFileClientModule) },
    { path: 'update-file', canActivate: [ClientAccessPermissionGuard], loadChildren: () => import("../update-file/client/update.file.client.module").then(m => m.UpdateFileClientModule) },
    { path: 'unauthorized', component : UnAuthorizedStoreComponent}
]

@NgModule({
    declarations: [
        TransactionsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ]
})

export class TransactionsModule {

}