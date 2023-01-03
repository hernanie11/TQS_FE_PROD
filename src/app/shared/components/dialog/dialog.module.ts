import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
const MaterialModules = [
    MatDialogModule,
    MatButtonModule
]
@NgModule({
    declarations: [
        DialogComponent
    ],
    imports: [
        MaterialModules
    ],
    exports: [
        DialogComponent
    ],
})
export class DialogModule { }