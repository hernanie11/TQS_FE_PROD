import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { AreasServices } from "../../areas/areas.service";
import { BusinessModelServices } from "../../business-model/business.model.service";
import { ClusterServices } from "../../clusters/clusters.service";
import { RegionService } from "../../region/region.service";
import { StoreCodesServices } from "../../store-codes/store.codes.service";
import { StoresDialogComponent } from "../dialog/stores.dialog.component";
import { areaPlaceHolder, businessModelPlaceHolder, clusterPlaceHolder, regionPlaceHolder, storeCodePlaceHolder, StoresServices } from "../stores.service";

@Component({
    selector: 'app-stores-edit',
    templateUrl: './stores.edit.component.html',
    styleUrls: ['./stores.edit.component.scss']
})

export class StoresEditComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private storesServices: StoresServices,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private areaServices: AreasServices,
        private clusterServices: ClusterServices,
        private businessModelServices: BusinessModelServices,
        private storeStatusCodesServices: StoreCodesServices,
        private helperServices: HelperServices,
        private regionServices: RegionService,
    ) { }

    /** @LifeCycles ========================================================= */
    ngOnInit(): void {
        this.populateRegions()
        this.getStoreById()
        this.subscribeDropDown()
    }
    ngAfterViewInit(): void {
        this.populateDropDowns()
    }

    /** @States ========================================================= */
    title: string = "Store Edit";
    storeIdParams: number = this.route.snapshot.params["storeId"]
    storeForm: FormGroup = this.fb.group({
        code: ["", Validators.required],
        name: ["", Validators.required],
        area: ["", Validators.required],
        region: ["", Validators.required],
        cluster: ["", Validators.required],
        business_model: ["", Validators.required],
        token: [""]
    })
    isGettingStoreById: boolean = false;
    storeClone: any;
    btnAction: "Nothing to update" | "Update" = "Nothing to update";
    isGenerateTokenLoading: boolean;
    storeCode: string = "";

    dtToken = new MatTableDataSource<any>()
    displayedColumnsToken: string[] = [
        "token",
        "status",
        "actions"
    ]

    /** @Methods ========================================================= */
    populateRegions() {
        // this.storesServices.getAllRegions().subscribe(res => {
        //     this.regions = res;
        // })
    }

    getToken() {
        let { token } = this.storeForm.value;
        return token;
    }

    copyToken() {
        this.snackbar.open("Token Copied to clipboard", "", { duration: 3000 });
    }
    lblLoading: "Loading..." | "No Data" | "No Store Found" | "Server cannot be reach. Please Try Again Later" = "Loading...";

    populateToken() {
        this.isGenerateTokenLoading = true;
        this.storesServices.getTokensByStoreId(this.storeIdParams).subscribe(tokens => {
            this.isGenerateTokenLoading = false;
            const { status, body } = tokens;
            if(status == 200) {
                if(body == 0) this.lblLoading = "No Data";
                this.dtToken.data = body
            }
        })
    }
    getStoreById() {
        this.isGettingStoreById = true;
        this.storesServices.getStoreById(this.storeIdParams).subscribe(res => {
            this.storesServices.getTokensByStoreId(this.storeIdParams).subscribe(tokens => {
                const { status, body } = tokens;
                if(status == 200) {
                    if(body == 0) this.lblLoading = "No Data";
                    this.dtToken.data = body
                }
                this.isGettingStoreById = false;
                const { data: { store: { code, name, area, region, cluster, business_model, token } }, isStoreExist } = res;
                this.storeCode = code;
                this.storeClone = { code, name, area, region, cluster, business_model, token };

                if (isStoreExist) {
                    this.storeForm.patchValue({
                        code,
                        name,
                        area,
                        region,
                        cluster,
                        business_model,
                        token
                    })
                }

            })

        })
    }

    formValidation() {
        if (!this.storeForm.valid) {
            return true
        }
        else {
            return false
        }
    }

    checkFormValueChanges() {
        this.storeForm.valueChanges.subscribe(() => {
            this.ifSomethingToChangeValue()
        })
    }

    ifSomethingToChangeValue() {
        if (this.storeClone["code"] != this.storeForm.value["code"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.storeClone["name"] != this.storeForm.value["name"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.storeClone["area"] != this.storeForm.value["area"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.storeClone["region"] != this.storeForm.value["region"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.storeClone["cluster"] != this.storeForm.value["cluster"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.storeClone["business_model"] != this.storeForm.value["business_model"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.storeClone["token"] != this.storeForm.value["token"]) {
            this.btnAction = "Update";
            return true
        }

        else {
            this.btnAction = "Nothing to update";
            return false
        }
    }

    update() {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to update this store?",
                action: "updateStore",
                button_name: "Update",
                storeId: this.storeIdParams,
                storeForm: this.storeForm.value
            }
        })
    }

    back() {
        if (this.ifSomethingToChangeValue()) {
            this.dialog.open(StoresDialogComponent, {
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
            this.router.navigate(["/admin/stores"])
        }
    }

    reset() {
        this.storeForm.controls['code'].reset()
        this.storeForm.controls['name'].reset()
        this.storeForm.controls['area'].reset()
        this.storeForm.controls['region'].reset()
        this.storeForm.controls['cluster'].reset()
        this.storeForm.controls['business_model'].reset()
    }

    public StoreCodeFilterCtrl: FormControl = new FormControl();
    public AreasFilterCtrl: FormControl = new FormControl();
    public ClustersFilterCtrl: FormControl = new FormControl();
    public BusinessModelFilterCtrl: FormControl = new FormControl();
    public RegionFilterCtrl: FormControl = new FormControl();

    public filteredStoreCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredAreas: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredClusters: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredBusinessModel: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredRegion: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    protected _onDestroy = new Subject<void>();

    statusCodes: any = []
    areas: any = []
    clusters: any = []
    businessModels: any = []
    regions: any = []
    protected filterStatusCodes() {
        if (!this.statusCodes) {
            return;
        }

        let search = this.StoreCodeFilterCtrl.value;
        if (!search) {
            this.filteredStoreCodes.next(this.statusCodes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredStoreCodes.next(
            this.statusCodes.filter((ac: any) => ac.store_code.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterAreas() {
        if (!this.areas) {
            return;
        }
        // get the search keyword
        let search = this.AreasFilterCtrl.value;
        if (!search) {
            this.filteredAreas.next(this.areas.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredAreas.next(
            this.areas.filter((ac: any) => ac.area.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterClusters() {
        if (!this.clusters) {
            return;
        }

        let search = this.ClustersFilterCtrl.value;
        if (!search) {
            this.filteredClusters.next(this.clusters.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredClusters.next(
            this.clusters.filter((ac: any) => ac.cluster.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterBusinessModel() {
        if (!this.businessModels) {
            return;
        }

        let search = this.BusinessModelFilterCtrl.value;
        if (!search) {
            this.filteredBusinessModel.next(this.businessModels.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredBusinessModel.next(
            this.businessModels.filter((ac: any) => ac.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterRegion() {
        if (!this.regions) {
            return;
        }

        let search = this.RegionFilterCtrl.value;
        if (!search) {
            this.filteredRegion.next(this.regions.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredRegion.next(
            this.regions.filter((ac: any) => ac.region.toLowerCase().indexOf(search) > -1)
        );

    }

    storeCodePlaceHolder:storeCodePlaceHolder 
    areaPlaceHolder: areaPlaceHolder
    clusterPlaceHolder:clusterPlaceHolder 
    businessModelPlaceHolder:businessModelPlaceHolder 
    regionPlaceHolder:regionPlaceHolder 
    populateDropDowns() {
        this.storeStatusCodesServices.getStatusCodesNoPaginate('edit').subscribe((res: any) => {
            const { status, body } = res
            if(body.length == 0) this.storeCodePlaceHolder = "No Store Code Found"
            if(body.length > 0) this.storeCodePlaceHolder = "Find Store Code..."
            if (status == 200) {
                this.statusCodes = body
                this.filteredStoreCodes.next(this.statusCodes.slice());
            }
        }, err => {
            this.helperServices.catchError(err, true, 3000)
        })

        this.areaServices.getAreasNoPaginator().subscribe(res => {
            const { status, body } = res
            if (status == 200) {
                if(body.length == 0) this.areaPlaceHolder = "No Area Found"
                if(body.length > 0) this.areaPlaceHolder = "Find Area..."
                this.areas = body
                this.filteredAreas.next(this.areas.slice());
            }
        })

        this.clusterServices.getClustersNoPaginator().subscribe(res => {
            const { status, body } = res
            if (status == 200) {
                if(body.length == 0) this.clusterPlaceHolder = "No Cluster Found";
                if(body.length > 0) this.clusterPlaceHolder = "Find Cluster...";
                this.clusters = body
                this.filteredClusters.next(this.clusters.slice());
            }
        })

        this.businessModelServices.getBusinessModelNoPaginator().subscribe(res => {
            this.businessModelPlaceHolder = "Find Business Model";
            const { status, body } = res;
            if (status == 200) {
                if(body.length == 0) this.businessModelPlaceHolder = "No Business Model Found";
                if(body.length > 0) this.businessModelPlaceHolder = "Find Business Model";
                this.businessModels = body;
                this.filteredBusinessModel.next(this.businessModels.slice());
            }
        })

        this.regionServices.getRegionNoPaginator().subscribe(res => {
            this.regionPlaceHolder = "Find Region";
            const { status, body } = res;
            if (status == 200) {
                this.regions = body
                this.filteredRegion.next(this.regions.slice());
            }
        })




    }

    subscribeDropDown() {
        this.StoreCodeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterStatusCodes();
            });

        this.AreasFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterAreas();
            });

        this.ClustersFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterClusters();
            });

        this.BusinessModelFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBusinessModel();
            });
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    generateNewToken() {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to generate new token",
                action: "GenerateNewToken",
                store_id: this.storeIdParams
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isGenerated } = dialogResponse
            if(isGenerated) {
                this.populateToken()
            }
        })
    }

    @ViewChild('tblToken') table: MatTable<any>

    removeToken(tokenId: number) {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation", 
                question: "Are you sure you want to remove this token?",
                action: "RemoveToken",
                tokenId
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { isRemoved } = dialogResponse
            if(isRemoved) {
                this.populateToken()
                this.table.renderRows();
            }
        })
    }
}