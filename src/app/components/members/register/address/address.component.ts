import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MembersRegisterServices } from "../members.register.service";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    }
})

export class AddressComponent {
    constructor(
        public membersRegisterServices: MembersRegisterServices,
        private fb: FormBuilder
    ) {}

    @ViewChild("cbProvinces") cbProvinces: ElementRef
    ngOnInit(): void {
        this.populateProvince() 
        if(this.membersRegisterServices.addressForm.value.province) this.populateMunicipality() 
        if(this.membersRegisterServices.addressForm.value.municipality) this.populateBarangay()
        this.subscribeDropDown()
    }

    ngAfterViewInit(): void {
        // this.focusProvince()
    }

    focusProvince() {
        setTimeout(() => {
            console.log(`element ref`,this.cbProvinces)
            this.cbProvinces.nativeElement.focus()
        }, 0);
    }

    handleKeyboardEvent(e: KeyboardEvent) {
        if(e.ctrlKey && e.key == "ArrowLeft") {
            this.back()
        }
        if(e.ctrlKey && e.key == "ArrowRight") {
            this.next()
        }
        if(e.key == "Enter") {
            this.next()
        }
    }

    back() {
        this.membersRegisterServices.steps = "Birthday";
    }

    next() {
        if(!this.validateFields()) {
            this.membersRegisterServices.steps = "Email";
        }
    }

    validateFields() {
        if(this.membersRegisterServices.addressForm.valid == false)  {
            return true
        }
        return false;
    }

   
    public ProvinceFilterCtrl: FormControl = new FormControl();
    public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    provincePlaceHolder: provincePlaceHolder = "Loading...";

    public MunicipalityFilterCtrl: FormControl = new FormControl();
    public filteredMunicipality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    municipalityPlaceHolder: municipalityPlaceHolder = "Select province first";

    public BarangayFilterCtrl: FormControl = new FormControl();
    public filteredBarangay: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    barangayPlaceHolder: barangayPlaceHolder = "Select municipality first";
    protected _onDestroy = new Subject<void>();
    provinces: any = []
    municipalities: any = []
    barangays: any = []
    protected filterProvince() {
        if (!this.provinces) {
            return;
        }
        let search = this.ProvinceFilterCtrl.value;
        if (!search) {
            this.filteredProvince.next(this.provinces.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredProvince.next(
            this.provinces.filter((ac: any) => ac.prov_desc.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterMunicipality() {
        if (!this.municipalities) {
            return;
        }
        let search = this.MunicipalityFilterCtrl.value;
        if (!search) {
            this.filteredMunicipality.next(this.municipalities.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredMunicipality.next(
            this.municipalities.filter((ac: any) => ac.citymun_desc.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterBarangay() {
        if (!this.barangays) {
            return;
        }
        let search = this.BarangayFilterCtrl.value;
        if (!search) {
            this.filteredBarangay.next(this.barangays.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredBarangay.next(
            this.barangays.filter((ac: any) => ac.brgy_desc.toLowerCase().indexOf(search) > -1)
        );
    }

    subscribeDropDown() {
        this.ProvinceFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterProvince();
        });


        this.MunicipalityFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterMunicipality();
        });

        this.BarangayFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterBarangay();
        });
    }


    populateProvince() {
        this.membersRegisterServices.getProvinces().subscribe(res => {
            if(res.provinces.length == 0) this.provincePlaceHolder = "No Province Found";
            if(res.provinces.length > 0) this.provincePlaceHolder = "Find Province...";
            this.provinces = res.provinces;
            this.filteredProvince.next(this.provinces.slice());
        })
        
    }

    populateMunicipality() {
        this.membersRegisterServices.getMunicipalitiesByProvCode(this.membersRegisterServices.addressForm.value.province).subscribe(res => {
            console.log(`get municipalities`, res)
            this.membersRegisterServices.province = this.provinces.find((prov: any) => prov.prov_code == this.membersRegisterServices.addressForm.value.province).prov_desc
            if(res.municipals.length == 0) this.municipalityPlaceHolder = "No Municipality Found";
            if(res.municipals.length > 0) this.municipalityPlaceHolder = "Find Municipality...";
            this.municipalities = res.municipals;
            if(this.membersRegisterServices.addressForm.value.municipality) {
                this.membersRegisterServices.municipality = this.municipalities.find((mun: any) => mun.citymun_code == this.membersRegisterServices.addressForm.value.municipality).citymun_desc
            }
            this.filteredMunicipality.next(this.municipalities.slice());
        })
    }

    populateBarangay() {
        this.membersRegisterServices.getBarangaysByMunicipalityCode(this.membersRegisterServices.addressForm.value.municipality).subscribe(res => {
            console.log(`this.municipalities`, this.municipalities)
            if(this.municipalities.length > 0)  {
                this.membersRegisterServices.municipality = this.municipalities.find((mun: any) => mun.citymun_code == this.membersRegisterServices.addressForm.value.municipality).citymun_desc
            }

            if(res.barangays.length == 0) this.barangayPlaceHolder = "No Barangay Found";
            if(res.barangays.length > 0) this.barangayPlaceHolder = "Find Barangay...";
            this.barangays = res.barangays
            this.filteredBarangay.next(this.barangays.slice())
        })
    }



}

export type provincePlaceHolder = "Loading..." | "Find Province..." | "No Province Found";
export type municipalityPlaceHolder = "Loading..." | "Select province first" | "Find Municipality..." | "No Municipality Found";
export type barangayPlaceHolder = "Loading..." | "Select municipality first" | "Find Barangay..." | "No Barangay Found";