import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { AddressService } from "../address.service";

@Component({
    selector: 'app-address-table',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})

export class AddressTableComponent {
    constructor(
        private addressService: AddressService,
        private helperService: HelperServices
    ) {}
    title: string = "Addresses"
    searchValue: string = "";
    isTableLoading: boolean = false;
    dataSource = new MatTableDataSource<any>()
    displayedColumns: string[] = [
        "Province",
        "Municipality",
        "Barangay"
    ]
    lblLoading: TextError = "Loading..."
    @ViewChild("addressPaginator") addressPaginator: MatPaginator
    ngOnInit(): void {
      this.populateAddresses()
    }

    populateAddresses() {
        this.isTableLoading = true;
        this.addressService.getAddresses().subscribe(res => {
            res.provinces.map((prov: any) => {
                res.municipals.filter((muni: any) => muni.prov_code == prov.prov_code).map((filteredMuni: any) => {
                    res.barangays.filter((brgy: any) => brgy.citymun_code == filteredMuni.citymun_code).map((filteredBrgy: any) => {
                        this.dataSource.data.push({
                            province: prov.prov_desc,
                            municipality: filteredMuni.citymun_desc,
                            brgy: filteredBrgy.brgy_desc
                        })
                    })
                })
            })
            this.dataSource.paginator = this.addressPaginator
            this.isTableLoading = false;
            
        })
    }

    applyFilter(event: Event) {
        this.helperService.filterTable(event, this.dataSource)
    }
}