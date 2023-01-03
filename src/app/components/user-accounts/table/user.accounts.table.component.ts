import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { UserAccountsDialogComponent } from "../dialog/user-accounts.dialog.component";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-table',
    templateUrl: './user.accounts.table.component.html',
    styleUrls: ['./user.accounts.table.component.scss']
})

export class UserAccountTableComponent {

    constructor(
        public userAccountsServices: UserAccountsServices,
        private router: Router,
        private dialog: MatDialog,
        private helperServices: HelperServices,
    ) { }

    /** @LifeCycles ============================================================== */
    ngOnInit(): void {
        this.populateUserAccounts()
    }
   

    /** @States ============================================================== */
    title: string = "User-Accounts";
    isTableLoading: boolean = false;
    displayedColumns: string[] = [
        'id',
        'first_name',
        'last_name',
        'username',
        'is_active',
        'created_at',
        'actions',
    ];
    dataSource = new MatTableDataSource<any>();
    pageSizeOption: number[] = [5, 10, 15, 20];
    userAccountsPerPage: number = 5;
    totalUserAccounts: number = 0;
    currentPage = 1;
    searchValue: string = "";
    isSearched: boolean = false;
    isRateLimitReached = false;
    @ViewChild("userAccountPaginator") userAccountPaginator: MatPaginator
    lblLoading: TextError = "Loading...";
    /** @Methods  ============================================================== */
    populateUserAccounts() {
        this.isTableLoading = true;
        this.dataSource = new MatTableDataSource<IUserAccountTable>()
        this.userAccountsServices.getUserAccountsWithPaginator(this.currentPage, this.userAccountsPerPage).subscribe(res => {
            const isOK = this.helperServices.isOk(res)
            if(isOK) {
                const { body: { data, total } } = res;
                this.isTableLoading = false;
                if (data.length == 0) { this.lblLoading = "No Data"; }
                this.dataSource.data = data
                this.totalUserAccounts = total;
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    newUserAccount() {
        this.router.navigate(["/admin/user-accounts/new"])
    }

    editUserAccount(userId: number) {
        this.router.navigate(["/admin/user-accounts/edit", { userId: userId }])
    }

    deactivate(user: any) {
        const { is_active } = user;
        let rootWord;
        if (is_active) {
            rootWord = "Deactivate"
        }
        if (!is_active) {
            rootWord = "Activate"
        }

        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: `Are you sure you want to ${rootWord} this user account?`,
                action: "deactivateAccount",
                button_name: rootWord,
                user
            }
        }).afterClosed().subscribe(dialogRes => {
            if(dialogRes) {
                const { id, is_active } = dialogRes;
                let index = this.dataSource.data.findIndex((user: any) => user.id == id);
                this.dataSource.data[index].is_active = is_active;
                this.dataSource.data[index].changed = true;
            }
        })
    }

    resetPassword(user: any) {
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want reset this user account's password?",
                action: "resetPassword",
                button_name: "Reset Password",
                user
            }
        }).afterClosed().subscribe(dialogRes => {
            const { id, isReset } = dialogRes;
            let index = this.dataSource.data.findIndex((user: any) => user.id == id)
            this.dataSource.data[index].isReset = isReset
        })
    }

    searchUserAccount(isOnPage: boolean) {
        this.isTableLoading = true;
        if (this.searchValue == "") {
            this.isSearched = false;
            this.userAccountPaginator.pageIndex = 0;
            this.populateUserAccounts();
        }
        else {
            if (!isOnPage) {
                this.currentPage = 1;
                this.userAccountPaginator.pageIndex = 0;
            }
            this.lblLoading = "Loading...";
            this.userAccountsServices.searchUserAccount(this.searchValue, this.currentPage, this.userAccountsPerPage).subscribe(res => {
                const response = this.helperServices.isOk(res)
                if(response) {
                    const { body: { data, total } } = res;
                    this.dataSource.data = data;
                    this.totalUserAccounts = total;
                    this.isSearched = true;
                    this.isTableLoading = false;
                    if (data.length == 0) { this.lblLoading = "No Data Found" }
                }
            }, err => {
                const error = this.helperServices.catchError(err, false, 10000)
                this.lblLoading = error;
            })
        }
    }

    checkSearchValue() {
        if (this.searchValue == "") {
            if (this.isSearched) {
                this.clearSearch()
            }
        }
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateUserAccounts()
        this.userAccountPaginator.pageIndex = 0;

    }

    onChangePage(pageData: PageEvent) {
        if (!this.isSearched) {
            this.currentPage = pageData.pageIndex + 1;
            this.userAccountsPerPage = pageData.pageSize
            this.populateUserAccounts()
        }
        else {
            this.currentPage = pageData.pageIndex + 1;
            this.userAccountsPerPage = pageData.pageSize
            this.searchUserAccount(true)
        }
    }
}

interface IUserAccountTable {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    is_active: boolean;
}