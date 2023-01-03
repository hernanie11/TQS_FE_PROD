import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MembersTableComponent } from './table/members.table.component';
import { AdminContainerModule } from 'src/app/layouts/admin-container/admin.container.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MembersNewComponent } from './new/members.new.component';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MembersDialogComponent } from './dialog/members.dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MembersEditComponent } from './edit/members.edit.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressBarModule } from '@angular/material/progress-bar';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

const routes: Routes = [
  { path: '', component: MembersTableComponent },
  { path: 'new', component: MembersNewComponent },
  { path: 'edit', component: MembersEditComponent },
]

@NgModule({
  declarations: [
    MembersTableComponent,
    MembersNewComponent,
    MembersDialogComponent,
    MembersEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminContainerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    DirectivesModule,
    NgxMaskModule.forRoot(maskConfig),
    MatDialogModule,
    NgxSkeletonLoaderModule,
    MatSnackBarModule,
    NgxMatFileInputModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    MatProgressBarModule
  ]
})
export class MembersModule { }
