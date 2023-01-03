import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresTableComponent } from './table/stores.table.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminContainerModule } from 'src/app/layouts/admin-container/admin.container.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { StoresNewComponent } from './new/stores.new.component';
import { MatSelectModule } from '@angular/material/select';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MatDialogModule } from '@angular/material/dialog';
import { StoresDialogComponent } from './dialog/stores.dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoresEditComponent } from './edit/stores.edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
const routes: Routes = [
  { path: '', component: StoresTableComponent },
  { path: 'new', component: StoresNewComponent },
  { path: 'edit', component: StoresEditComponent },
]

@NgModule({
  declarations: [
    StoresTableComponent,
    StoresNewComponent,
    StoresEditComponent,
    StoresDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminContainerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    ClipboardModule,
    NgxSkeletonLoaderModule,
    NgxMatSelectSearchModule
  ]
})
export class StoresModule { }
