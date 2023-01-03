import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ExcelViewerComponent } from "./excel-viewer/excel.viewer.component";
import { ExcelWithPasswordComponent } from "./excel-with-password/excel-with-password.component";
import { JsonDbComponent } from "./json-db/json.db.component";
import { TreeComponent } from "./tree/tree.component";
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { HttpComponent } from "./http/http.component";
import { MatRippleModule } from "@angular/material/core";
import { PrintingComponent } from "./printing/printing.component";
import { NgxPrintDirective, NgxPrintModule } from 'ngx-print';
import { ChildComponent } from "./child/child.component";
import { CommonModule } from "@angular/common";
const routes: Routes = [
    { path: 'excel-viewer', component: ExcelViewerComponent },
    { path: 'excel-viewer-with-password', component: ExcelWithPasswordComponent },
    { path: 'json-db', component: JsonDbComponent },
    { path: 'tree', component: TreeComponent },
    { path: 'http', component: HttpComponent },
    { path: 'printing', component: PrintingComponent },

]

@NgModule({
    declarations: [
        ExcelViewerComponent,
        ExcelWithPasswordComponent,
        TreeComponent,
        HttpComponent,
        PrintingComponent,
        ChildComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgxMatFileInputModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        NgxPrintModule,
        CommonModule
    ],
    providers: [NgxPrintDirective]
})

export class SandboxModule {

}