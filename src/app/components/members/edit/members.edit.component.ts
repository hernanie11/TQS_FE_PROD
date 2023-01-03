import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { MembersDialogComponent } from "../dialog/members.dialog.component";
import { MembersServices, storesPlaceHolder } from "../members.service";

@Component({
    selector: 'app-members-edit',
    templateUrl: './members.edit.component.html',
    styleUrls: ['./members.edit.component.scss']
})

export class MembersEditComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private membersServices: MembersServices,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private helperServices: HelperServices
    ) {}

    /** @LifeCycles ======================================================= */
    ngOnInit(): void {
        this.populateMemberById()
        this.checkFormValueChanges()
        this.populateStores()
        this.subscribeDropDown()
    }

    /** @States =========================================================== */
    title: string = "Members Edit";
    memberIdParams: number = this.route.snapshot.params["memberId"];
    isGettingStoreById: boolean = false;
    memberClone: any;
    btnAction: "Nothing to update" | "Update" = "Nothing to update";
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
    })

    /** @Methods =========================================================== */
    populateMemberById() {
        this.isGettingStoreById = true;
        this.membersServices.getMemberbyID(this.memberIdParams).subscribe(res => {
            this.isGettingStoreById = false;
            const { status, body: { data: { member }, message } } = res;
            if(status == 200) {
                const { first_name, last_name, gender, birthday, barangay, municipality, province, store_id, store_registered, email, mobile_number } = member;
                this.memberClone = { 
                    first_name, 
                    last_name, 
                    gender, 
                    birthday, 
                    barangay, 
                    municipality, 
                    province, 
                    store_id,
                    email, 
                    mobile_number: mobile_number
                };
                this.memberForm.patchValue({
                    first_name, 
                    last_name, 
                    gender, 
                    birthday, 
                    barangay, 
                    municipality, 
                    province, 
                    store_id,
                    email, 
                    mobile_number: mobile_number
                })
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000)
            
        })
    }

    update() {
        this.dialog.open(MembersDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to update this member?",
                action: "updateMember",
                button_name: "Update",
                memberForm: {
                    ...this.memberForm.value, 
                    mobile_number: this.memberForm.value.mobile_number,
                    birthday: moment(this.memberForm.value.birthday).format("yyyy-MM-DD")
                },
                memberId: this.memberIdParams
            }
        })
    }

    checkFormValueChanges() {
        this.memberForm.valueChanges.subscribe(() => {
            this.ifSomethingToChangeValue()
        })
    }

    ifSomethingToChangeValue() {
        if(JSON.stringify(this.memberClone) != JSON.stringify(this.memberForm.value)) {
            this.btnAction = "Update"
            return true
        }
        else {
           this.btnAction = "Nothing to update";
            return false;
        }
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

    back() {
        if(this.ifSomethingToChangeValue()) {
            this.dialog.open(MembersDialogComponent, {
                disableClose: true,
                data: {
                    title: "Confirmation",
                    question: "Discard changes?",
                    action: "discardChanges",
                    button_name: "Discard"
                }
            })
        }
        else {
            this.router.navigate(["/admin/members"])
        }
    }

    populateStores() {
        this.membersServices.populateStores().subscribe(res => {
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
    subscribeDropDown() {
        this.StoreFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterStores();
        });
    }
    
}