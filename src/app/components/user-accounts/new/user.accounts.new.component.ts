import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UserAccountsDialogComponent } from "../dialog/user-accounts.dialog.component";

@Component({
    selector: 'app-user-accounts-new',
    templateUrl: './user.accounts.new.component.html',
    styleUrls: ['./user.accounts.new.component.scss']
})

export class UserAccountsNewComponent {

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) { }

    /** @LifeCycles  ==============================================================*/
    ngOnInit(): void {
        this.convertAccessPermission()
    }

    /** @States ============================================================== */
    title: string = "User-Account New"
    adminPermissions = ["user-accounts", "members", "stores", "earned_redeemed", "transactions", "generate_file"]
    cashierPermissions = [""]
    userAccountForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        username: ["", Validators.required],
        password: ["", Validators.required],
        role: ["admin", Validators.required],
        access_permission: this.fb.group({
            user_accounts: [true],
            stores: [true],
            members: [true],
            earned_points: [true],
            redeemed_points: [true],
            cleared_points: [true],
            transactions: [],
            generate_file: [true],
            earning: [],
            redeeming: [],
            update_file: [true],
            reports: [true],
            change_store: [],
        }),
    })
    permissions: string[] = []

    /** @Methods =============================================================== */
    // addPermission(permission: string) {
    //     this.permissions.push(permission)
    // }

    convertAccessPermission() {
        this.permissions = [];
        let { access_permission: { user_accounts, stores, members, earned_points, redeemed_points, cleared_points, transactions, generate_file, update_file, earning, redeeming, reports, change_store } } = this.userAccountForm.value
        if (user_accounts) {
            this.permissions.push("user-accounts")
        }
        if (stores) {
            this.permissions.push("stores")
        }
        if (members) {
            this.permissions.push("members")
        }
        if (earned_points) {
            this.permissions.push("earned-points")
        }
        if (redeemed_points) {
            this.permissions.push("redeemed-points")
        }
        if (cleared_points) {
            this.permissions.push("cleared-points")
        }
        if (earning) {
            this.permissions.push("earning")
        }
        if (redeeming) {
            this.permissions.push("redeeming")
        }
        if (transactions) {
            this.permissions.push("transactions")
        }
        if (generate_file) {
            this.permissions.push("generate-file")
        }
        if(update_file) {
            this.permissions.push("update-file")
        }
        if (reports) {
            this.permissions.push("reports")
        }
        if (change_store) {
            this.permissions.push("change-store")
        }
        this.userAccountForm.value.access_permission = this.permissions
    }

    getRole() {
        let { role } = this.userAccountForm.value;
        return role;
    }

    create() {
        console.log(this.userAccountForm.value)
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to create this User Account?",
                action: "createUserAccount",
                button_name: "Create",
                userAccountForm: this.userAccountForm.value
            }
        })
    }

    resetPermissions() {
        this.userAccountForm.patchValue({
            access_permission: {
                user_accounts: false,
                stores: false,
                members: false,
                earned_points: false,
                redeemed_points: false,
                cleared_points: false,
                transactions: false,
                generate_file: false,
                update_file: false,
                earning: false,
                redeeming: false,
                reports: false,
                change_store: false,
            }
        })
        this.permissions = []
    }

    formValidation() {
        if (!this.userAccountForm.valid || this.permissions.length == 0) {
            return true
        }
        else { return false }
    }

    inputControl(property: string) {
        return this.userAccountForm.controls[property]
    }

    back() {
        this.router.navigate(["/admin/user-accounts"])
    }
}
