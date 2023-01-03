import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { MembersDialogComponent } from "../dialog/members.dialog.component";
import { MembersServices } from "../members.service";

@Component({
    selector: 'app-members-table',
    templateUrl: './members.table.component.html',
    styleUrls: ['./members.table.component.scss']
})

export class MembersTableComponent {
    constructor(
        private membersServices: MembersServices,
        private router: Router,
        private dialog: MatDialog,
        private helperServices: HelperServices
    ) { }

    /** @LifeCycles ================================================= */
    ngOnInit(): void {
        this.populateMembersWithPaginator()
    }

    /** @States ====================================================== */
    title: string = "Members";
    searchValue: string = "";
    isTableLoading: boolean = false;
    dataSource = new MatTableDataSource<any>()
    displayedColumns: string[] = [
        "id",
        "first_name",
        "last_name",
        "gender",
        "birthday",
        "barangay",
        "municipality",
        "province",
        "email",
        "mobile_number",
        "status",
        "store_registered",
        "created_at",
        "actions",
    ]
    lblLoading: TextError = "Loading...";
    isSearched: boolean = false;
    pageSizeOption: number[] = [5, 10, 15, 20];
    memberPerPage: number = 5;
    totalItems: number = 0;
    @ViewChild("memberPaginator") memberPaginator: MatPaginator
    currentPage = 1;

    /** @Methods ====================================================== */
    checkSearchValue() {
        if (this.searchValue == "") if (this.isSearched) this.clearSearch()
    }

    populateMembersWithPaginator() {
        this.isTableLoading = true;
        this.dataSource.data = []
        this.lblLoading = "Loading..."
        this.membersServices.getMembersWithPaginator(this.searchValue, this.currentPage, this.memberPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if(status == 200) {
                if(data.length == 0) this.lblLoading = "No Data";
                this.dataSource.data = data
                this.totalItems = total;
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    newMember() {
        this.router.navigate(["/admin/members/new"])
    }

    searchMember() {
        this.isTableLoading = true;
        this.membersServices.getMembersWithPaginator(this.searchValue, this.currentPage, this.memberPerPage).subscribe(res => {
            this.isTableLoading = false;
            const { status, body: { data, total } } = res;
            if(status == 200) {
                if(data.length == 0) this.lblLoading = "No Data Found";
                this.dataSource.data = data
                this.totalItems = total;
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000)
            this.lblLoading = error;
        })
    }

    clearSearch() {
        this.searchValue = "";
        this.isSearched = false;
        this.populateMembersWithPaginator()
        this.memberPaginator.pageIndex = 0;
        this.currentPage = 1;
    }

    editMember(memberId: number) {
        this.router.navigate(["/admin/members/edit", { memberId }])
    }

    activateInactivate(action: string, member: any) {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: `Are you sure want to ${action} this store?`,
                action: "activeInActive",
                button_name: action,
                member
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { memberId, status } = dialogResponse;
            if (status) {
                let index = this.dataSource.data.findIndex((member: any) => member.id == memberId)
                this.dataSource.data[index].status = status;
                this.dataSource.data[index].hasChanged = true;
            }

        })
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.memberPerPage = pageData.pageSize
        this.populateMembersWithPaginator()
    }

    upload() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Import Members",
                action: "import-members-validation"
            }
        }).afterClosed().subscribe(dialogResponse => {
            if (dialogResponse) {
                this.populateMembersWithPaginator()
            }
        })
        
    }

   
}

interface IMemberDataSource {
    id: number;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    barangay: string;
    municipality: string;
    province: string;
    email: string;
    mobile_number: string;
    status: string;
    created_at?: string;
    hasChanged?: boolean
}
