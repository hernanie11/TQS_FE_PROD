import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AdminContainerComponent } from "./admin.container.component";

@NgModule({
    declarations: [
        AdminContainerComponent
    ],
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule
    ],
    exports: [
        AdminContainerComponent
    ]
})

export class AdminContainerModule {

}