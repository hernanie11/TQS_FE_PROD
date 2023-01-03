import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppServices } from "src/app/app.service";
import { CredServices } from "src/app/shared/services/cred.service";
import { HelperServices } from "src/app/shared/services/helpers.service";

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    // host: {
    //     '(document:keypress)': 'handleKeyboardEvent($event)'
    // }
})

export class TransactionsComponent {


    constructor(
        public credServices: CredServices,
        public appServices: AppServices,
        private router: Router,
        public helperServices: HelperServices
    ) { }

    getStoreName() {
        return this.credServices.getCredentials().activated_store.storeObject.name
    }
    redeem() {
        if (this.appServices.internetForm.value.isOnline) {
            this.router.navigate(['/client/transactions/redeem-points'])
        }
    }
    handleKeyboardEvent(e: KeyboardEvent) {
        if (e.key == "1") {
            this.router.navigate(["/client/transactions/register-customer"])
        }
        if (e.key == "2") {
            this.router.navigate(["/client/transactions/earn-points"])
        }
        if (e.key == "3") {
            this.router.navigate(["/client/transactions/redeem-points"])
        }
        if (e.key == "4") {
            this.router.navigate(["/client/transactions/transaction-points"])
        }
        if (e.key == "5") {
            this.router.navigate(["/client/transactions/customer-info"])
        }
    }
}