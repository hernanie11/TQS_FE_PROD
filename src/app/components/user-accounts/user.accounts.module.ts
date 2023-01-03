import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountTableComponent } from './table/user.accounts.table.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AdminContainerModule } from 'src/app/layouts/admin-container/admin.container.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserAccountsNewComponent } from './new/user.accounts.new.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { UserAccountsDialogComponent } from './dialog/user-accounts.dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { UserAccountEditComponent } from './edit/user.accounts.edit.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const routes: Routes = [
  { path: '', component: UserAccountTableComponent },
  { path: 'new', component: UserAccountsNewComponent },
  { path: 'edit', component: UserAccountEditComponent },
]

@NgModule({
  declarations: [
    UserAccountTableComponent,
    UserAccountsNewComponent,
    UserAccountsDialogComponent,
    UserAccountEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    AdminContainerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    NgxSkeletonLoaderModule
  ]
})
export class UserAccountsModule { }
