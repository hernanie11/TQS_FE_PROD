import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
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
    selector: 'app-stores-new',
    templateUrl: './stores.new.component.html',
    styleUrls: ['./stores.new.component.scss']
})

export class StoresNewComponent {

    constructor(
        private router: Router,
        private storesServices: StoresServices,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private storeStatusCodesServices: StoreCodesServices,
        private helperServices: HelperServices,
        private areaServices: AreasServices,
        private clusterServices: ClusterServices,
        private businessModelServices: BusinessModelServices,
        private regionServices: RegionService,
    ) { }

    /** @LifeCycles ========================================================= */
    ngOnInit(): void {
        this.populateDropDowns()
        this.subscribeDropDown()
      
    }
    /** @States ========================================================= */
    title: string = "Store New";
    storeForm: FormGroup = this.fb.group({
        code: ["", Validators.required],
        name: ["", Validators.required],
        area: ["", Validators.required],
        region: ["", Validators.required],
        cluster: ["", Validators.required],
        business_model: ["", Validators.required],
    })

    /** @Methods ========================================================= */

    create() {
        this.dialog.open(StoresDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to create this store?",
                action: "createStore",
                button_name: "Create",
                storeForm: this.storeForm.value
            }
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

    back() {
        this.router.navigate(["/admin/stores"])
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

    storeCodePlaceHolder: storeCodePlaceHolder = "Loading...";
    areaPlaceHolder: areaPlaceHolder = "Loading..."
    clusterPlaceHolder: clusterPlaceHolder = "Loading..."
    businessModelPlaceHolder: businessModelPlaceHolder = "Loading...";
    regionPlaceHolder: regionPlaceHolder  = "Loading...";
    populateDropDowns() {
        this.storeStatusCodesServices.getStatusCodesNoPaginate('create').subscribe(res => {
            const { status, body } = res
            if(body.length == 0) this.storeCodePlaceHolder = "No Store Code Found";
            if(body.length > 0) this.storeCodePlaceHolder = "Find Store Code...";
            if(status == 200) {
                this.statusCodes = body
                this.filteredStoreCodes.next(this.statusCodes.slice());
            }
        }, err => {
            this.helperServices.catchError(err, true, 3000)
        })

        this.areaServices.getAreasNoPaginator().subscribe(res => {
            const { status, body } = res
            if(status == 200) {
                if(body.length == 0) this.areaPlaceHolder = "No Area Found";
                if(body.length > 0) this.areaPlaceHolder = "Find Area...";
                this.areas = body
                this.filteredAreas.next(this.areas.slice());
            }
        })

        this.clusterServices.getClustersNoPaginator().subscribe(res => {
            const { status, body } = res
            if(status == 200) {
                if(body.length == 0) this.clusterPlaceHolder = "No Cluster Found";
                if(body.length > 0) this.clusterPlaceHolder = "Find Cluster...";
                this.clusters = body
                this.filteredClusters.next(this.clusters.slice());
            }
        })

        this.businessModelServices.getBusinessModelNoPaginator().subscribe(res => {
            const { status, body } = res;
            if(status == 200) {
                if(body.length == 0) this.businessModelPlaceHolder = "No Business Model Found"
                if(body.length > 0) this.businessModelPlaceHolder = "Find Business Model"
                this.businessModels = body;
                this.filteredBusinessModel.next(this.businessModels.slice());
            }
        })
        
        this.regionServices.getRegionNoPaginator().subscribe(res => {
            const { status, body } = res;
            if(status == 200) {
                if(body.length == 0) this.regionPlaceHolder = "No Region Found";
                if(body.length > 0) this.regionPlaceHolder = "Find Region";
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

        this.RegionFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterRegion();
        });
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

} 