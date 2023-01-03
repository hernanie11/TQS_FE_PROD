import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { MembersDialogComponent } from "../dialog/members.dialog.component";
import { MembersServices, storesPlaceHolder } from "../members.service";

@Component({
    selector: 'app-members-new',
    templateUrl: './members.new.component.html',
    styleUrls: ['./members.new.component.scss']
})

export class MembersNewComponent {

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router,
        private memberServices: MembersServices,
        private helperServices: HelperServices
    ) {}

    /** @States ===================================================== */
    title: string = "Member New";
    memberForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        gender: ["", Validators.required],
        birthday: ["", Validators.required],
        barangay: ["", Validators.required],
        municipality: ["", Validators.required],
        province: ["", Validators.required],
        store_id: ["", Validators.required],
        email: ["", [Validators.email]],
        mobile_number: ["", [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
        primary_cook: ["primary"],
        working_status: ["working"]
    })

    ngOnInit(): void {
        this.populateStores()
        this.subscribeDropDown()
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /** @Methods ===================================================== */
    create() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to create this member?",
                action: "createMember",
                button_name: "Create",
                memberForm: {
                    ...this.memberForm.value, 
                    mobile_number: this.memberForm.value.mobile_number,
                    birthday: moment(this.memberForm.value.birthday).format("yyyy-MM-DD")
                }
            }
        })
    }

    back() {
        this.router.navigate(["/admin/members"])
    }

    formValidation() {
        if(!this.memberForm.valid) {
            return true
        }
        else {
            return false
        }
    }

    inputControl(property: string) {
        return this.memberForm.controls[property]
    }

    public StoreFilterCtrl: FormControl = new FormControl();
    public filteredStores: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    protected _onDestroy = new Subject<void>();
    storesPlaceHolder: storesPlaceHolder = "Loading...";
    stores: any = []

    protected filterStores() {
        if (!this.stores) {
            return;
        }

        let search = this.StoreFilterCtrl.value;
        if (!search) {
            this.filteredStores.next(this.stores.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredStores.next(
            this.stores.filter((ac: any) => ac.name.toLowerCase().indexOf(search) > -1)
        );
    }
    
    populateStores() {
        this.memberServices.populateStores().subscribe(res => {
            const { status, body } = res;
            if(status == 200) {
                this.stores = body
                this.filteredStores.next(this.stores.slice());
                if(body.length == 0) this.storesPlaceHolder = "No Store Found"
                if(body.length > 0) this.storesPlaceHolder = "Find Store..."
            }
        }, err => {
            this.helperServices.catchError(err, true, 3000)
        })
    }

    subscribeDropDown() {
        this.StoreFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterStores();
        });
    }
}

