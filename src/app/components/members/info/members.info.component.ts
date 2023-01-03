import { Component } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TextError } from "src/app/interfaces/errors";
import { CredServices } from "src/app/shared/services/cred.service";
import { MembersServices } from "../members.service";

@Component({
    selector: 'app-members-info',
    templateUrl: './members.info.component.html',
    styleUrls: ['./members.info.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class MembersInfoComponent {
    constructor(
        private credServices: CredServices,
        private router: Router,
        private memberServices: MembersServices
    ) {}

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.key == "Escape") {
            this.router.navigate(["/client/transactions"])
        }
    }
    
    searchValue: string = ""
    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalItems: number = 0
    dataSource = new MatTableDataSource<any>()
    pageSizeOption: number[] = [5, 10, 15, 20]
    displayedColumns: string[] = [
        // "id",
        "mobile_number",
        "first_name",
        "last_name",
        "gender",
        "birthday",
        "email",
        "barangay",
        "municipality",
        "province",
        // "actions",
    ]
    lblLoading: TextError = "Loading...";
    getStoreName(): any {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }

    filter(event: Event) {

    }

    back() {
        this.router.navigate(['/client/transactions'])
    }

    populateMembers() {
        this.memberServices.getMembersInClient(this.searchValue, this.currentPage, this.itemsPerPage ).subscribe(res => {
            if(res.body.docs.length == 0) this.lblLoading = "No Data Found";
            this.dataSource.data = res.body.docs
            this.totalItems = res.body.totalDocs
        })
    }

    onChangePage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.itemsPerPage = pageData.pageSize
        this.populateMembers()
    }

    searchMember() {
        this.memberServices.getMembersInClient(this.searchValue, this.currentPage, this.itemsPerPage ).subscribe(res => {
            if(res.body.docs.length.length == 0) this.lblLoading = "No Data Found";
            this.dataSource.data = res.body.docs
            this.totalItems = res.body.totalDocs
        })
    }

    ngOnInit(): void {
        this.populateMembers()
    }
}