import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutAdminComponent } from "./layout.admin.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedLayoutsModule } from "src/app/shared/layouts/shared.layouts.module";
import { CommonModule } from "@angular/common";
import { NotFoundComponent } from "src/app/components/not-found/not-found.component";
import { SidebarCssSelected } from "src/app/guards/sidebar.css.selected";
import { AdminAccessGuard } from "src/app/guards/admin.access.guard";
import { UnauthorizedComponent } from "src/app/components/unauthorized/unauthorized.component";
import { ChangePasswordModule } from "src/app/components/change-password/change.password.module";

const routes: Routes = [
    {
        path: '', component: LayoutAdminComponent,
        children: [
            { path: '', redirectTo: "user-accounts", pathMatch: "full" },
            { path: 'addresses', canActivate: [SidebarCssSelected], loadChildren: () => import("../../components/address/address.module").then(m => m.AddressModule) },
            { path: 'user-accounts', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/user-accounts/user.accounts.module").then(m => m.UserAccountsModule) },
            { path: 'stores', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/stores/stores.module").then(m => m.StoresModule) },
            { path: 'store-codes', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/store-codes/store.codes.module").then(m => m.StoreCodesModule) },
            { path: 'areas', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/areas/areas.module").then(m => m.AreasModule) },
            { path: 'regions', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/region/region.module").then(m => m.RegionModule) },
            { path: 'clusters', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/clusters/clusters.module").then(m => m.ClustersModule) },
            { path: 'business-model', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/business-model/business.model.module").then(m => m.BusinessModelModule) },
            { path: 'members', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/members/members.module").then(m => m.MembersModule) },
            { path: 'earned-points', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/earned-points/earned.points.module").then(m => m.EarnedPointsModule) },
            { path: 'redeemed-points', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/redeemed-points/redeemed-points.module").then(m => m.RedeemedPointsModule) },
            { path: 'cleared-points', canActivate: [SidebarCssSelected, AdminAccessGuard], loadChildren: () => import("../../components/cleared-points/cleared.points.module").then(m => m.ClearedPointsModule) },
            { path: 'generate-file', canActivate: [SidebarCssSelected], loadChildren: () => import("../../components/generate-file/generate.file.module").then(m => m.GenerateFileModule) },
            { path: 'update-file', canActivate: [SidebarCssSelected], loadChildren: () => import("../../components/update-file/admin/update.file.admin.module").then(m => m.UpdateFileAdminModule) },
            { path: 'reports', canActivate: [SidebarCssSelected], loadChildren: () => import("../../components/reports/reports.module").then(m => m.ReportsModule) },
            { path: 'settings', canActivate: [SidebarCssSelected], loadChildren: () => import("../../components/settings/settings.module").then(m => m.SettingsModule) },
            { path: 'unauthorized', component: UnauthorizedComponent },
            { path: '**', component: NotFoundComponent },
        ]
    }
]

const MaterialModules = [
    MatSidenavModule
]

@NgModule({
    declarations: [
        LayoutAdminComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModules,
        SharedLayoutsModule,
        CommonModule,
        ChangePasswordModule
    ]
})

export class LayoutAdminModule {

}