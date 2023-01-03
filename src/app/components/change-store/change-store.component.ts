import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { LocalService } from "src/app/shared/services/local.service";
import { InstallationServices } from "../portal/installation/installation.service";
import { ChangeStoreService } from "./change-store.service";
@Component({
    selector: 'app-change-store',
    templateUrl: './change-store.component.html',
    styleUrls: ['./change-store.component.scss']
})

export class ChangeStoreComponent {
    constructor(
        private dialogRef: MatDialogRef<ChangeStoreComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeStoreService: ChangeStoreService,
        private helperServices: HelperServices,
        private installationService: InstallationServices,
        private fb: FormBuilder,
        private snackbar: MatSnackBar,
        private router: Router,
        private localService: LocalService,
        private dialog: MatDialog,
        private credServices: CredServices
    ) { }

    ngOnInit(): void {
        this.populateDropdown()
        this.subscribeDropDown()
        console.log(this.credServices.getCredentials());
    }
    hide: boolean = true;
    tokenValid: boolean = false;
    tokenValidationMessage: "Token is valid" | "Token is invalid";
    public StoreFilterCtrl: FormControl = new FormControl();
    public filteredStore: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    stores: any[] = []
    storesPlaceHolder: storePlaceHolder = "Loading...";
    protected _onDestroy = new Subject<void>();
    protected filterStatusCodes() {
        if (!this.stores) {
            return;
        }
        let search = this.StoreFilterCtrl.value;
        if (!search) {
            this.filteredStore.next(this.stores.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredStore.next(
            this.stores.filter((ac: any) => ac.name.toLowerCase().indexOf(search) > -1)
        );
    }

    populateDropdown() {
        this.installationService.getStores().subscribe(res => {
            console.log(res)
            if (res == 0) this.storesPlaceHolder = "No Store Found";
            if (res > 0) this.storesPlaceHolder = "Find Store...";
            this.stores = res
                this.filteredStore.next(this.stores.slice());
        }, err => {
            this.helperServices.catchError(err, true, 3000)
        })
    }

    subscribeDropDown() {
        this.StoreFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterStatusCodes();
            });
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    storeActivateForm = this.fb.group({
        store_id: ['', Validators.required],
        token: ['', Validators.required]
    });

    isValidatingToken: boolean = false;
    newStore: INewStore | undefined;
    validate() {
        this.newStore = undefined;
        this.isValidatingToken = true;
        this.installationService.validateToken(this.storeActivateForm.value).subscribe(res => {
            console.log(res)
            this.isValidatingToken = false;
            this.tokenValid = res.valid;
            this.tokenValidationMessage = res.message;
            this.changeStoreService.checkStoreExists(res.store.id).subscribe(storeResponse => {
                if(storeResponse == false) {
                    this.newStore = {
                        store_mysql_id: res.store.id,
                        business_category_id: res.store.businesscategory_id,
                        code: res.store.code,
                        name: res.store.name,
                        area: res.store.area,
                        region: res.store.region,
                        cluster: res.store.cluster,
                        business_model: res.store.business_model,
                        token: this.storeActivateForm.value.token
                    }
                }
            })
            
        }, err => {
            const { error: { message, valid } } = err;
            this.isValidatingToken = false;
            this.tokenValidationMessage = message;
            this.tokenValid = valid;
            if (message) {
                this.snackbar.open(message, "", { duration: 3000 })
            }
            else {
                this.snackbar.open("Internet Connection Interrupt", "", { duration: 3000 })
            }
        })
    }

    isActivatingNewStore: boolean = false;
    changeStore() {
        this.isActivatingNewStore = true;
        const newStore = {
            store_mysql_id : this.storeActivateForm.value.store_id,
            token: this.storeActivateForm.value.token,
            activated_date: `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}`
        }
        this.changeStoreService.updateStoreActivate(newStore).subscribe(res => {
            this.installationService.activateStoreInAdmin(this.storeActivateForm.value.token).subscribe(() => {
                if(this.newStore) {
                    this.changeStoreService.createNewStore(this.newStore).subscribe(createdStore => {
                        this.isActivatingNewStore = false;
                        this.snackbar.open("Store Change Successfully", "", { duration: 3000})
                        this.dialog.open(ChangeStoreComponent, {
                            disableClose: true,
                            width: "350px",
                            data: {
                                action: "re-login-confirmation"
                            }
                        })
                    })
                }
                else {
                    this.isActivatingNewStore = false;
                    this.snackbar.open("Store Change Successfully", "", { duration: 3000})
                    this.dialog.open(ChangeStoreComponent, {
                        disableClose: true,
                        width: "350px",
                        data: {
                            action: "re-login-confirmation"
                        }
                    })
                }
               
            })
            
        })
    }

    close() {
        this.dialogRef.close()
    }

    relogin() {
        this.localService.clearToken();
        this.router.navigate(['/login']).then(() => location.reload())
        this.dialogRef.close()
    }
}

export type storePlaceHolder = "Loading..." | "Find Store..." | "No Store Found";
interface INewStore {
    store_mysql_id: number,
    business_category_id: number,
    code: string,
    name: string,
    area: string,
    region: string,
    cluster: string,
    business_model: string,
    token: string
} 