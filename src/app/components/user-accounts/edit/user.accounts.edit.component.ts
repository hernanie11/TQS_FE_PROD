import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TextError } from "src/app/interfaces/errors";
import { HelperServices } from "src/app/shared/services/helpers.service";
import { UserAccountsDialogComponent } from "../dialog/user-accounts.dialog.component";
import { UserAccountsServices } from "../user-accounts.service";

@Component({
    selector: 'app-user-accounts-edit',
    templateUrl: './user.accounts.edit.component.html',
    styleUrls: ['./user.accounts.edit.component.scss']
})

export class UserAccountEditComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userAccountServices: UserAccountsServices,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private helperServices: HelperServices
    ) { }

    /** @LifeCycles ========================================================= */
    ngOnInit(): void {
        this.populateUserAccountByUserId()
        this.checkFormValueChanges()
    }

    /** @States ========================================================= */
    title: string = "User-Account Edit";
    userIdParams: number = this.route.snapshot.params["userId"]
    roleQuery: "admin" | "cashier";
    userAccountForm: FormGroup = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        username: ["", Validators.required],
        role: ["", Validators.required],
        access_permission: this.fb.group({
            user_accounts: [],
            stores: [],
            members: [],
            earned_points: [],
            redeemed_points: [],
            cleared_points: [],
            transactions: [],
            generate_file: [],
            earning: [],
            redeeming: [],
            update_file: [],
            reports: [],
            change_store: [],
        }),
    })
    isGettingUserAccountById: boolean = false;
    userAccountClone: any;
    permissions: string[] = [];
    btnAction: "Nothing to update" | "Update" = "Nothing to update";
    httpStatusText: TextError = "";
    hasHttpError: boolean = false;

    /** @Methods ============================================================== */
    populateUserAccountByUserId() {
        this.isGettingUserAccountById = true;
        this.userAccountServices.getUserAccountById(this.userIdParams).subscribe(res => {
            const isOk = this.helperServices.isOk(res)
            if (isOk) {
                const { body: { isUserExist, data: { user } } } = res;
                this.isGettingUserAccountById = false;
                this.userAccountClone = user;
                this.roleQuery = user.role
                const access_permission = user.access_permission.split(", ");
                if (isUserExist) {
                    this.userAccountForm.patchValue({
                        first_name: user.first_name,
                        last_name: user.last_name,
                        username: user.username,
                        role: user.role,
                    })
                    access_permission.map((access: string) => {
                        this.populatePermissionValue(access);
                    })
                    this.convertAccessPermission()
                }
            }
        }, err => {
            const error = this.helperServices.catchError(err, true, 3000);
            this.httpStatusText = error;
            this.hasHttpError = true;
            this.isGettingUserAccountById = false;
        })
    }

    populatePermissionValue(access: string) {
        switch (access) {
            case "user-accounts":
                this.userAccountForm.patchValue({
                    access_permission: {
                        user_accounts: true
                    }
                })
                break;
            case "stores":
                this.userAccountForm.patchValue({
                    access_permission: {
                        stores: true
                    }
                })
                break;
            case "members":
                this.userAccountForm.patchValue({
                    access_permission: {
                        members: true
                    }
                })
                break;

            case "earned-points":
                this.userAccountForm.patchValue({
                    access_permission: {
                        earned_points: true
                    }
                })
                break;

            case "redeemed-points":
                this.userAccountForm.patchValue({
                    access_permission: {
                        redeemed_points: true
                    }
                })
                break;

            case "cleared-points":
                this.userAccountForm.patchValue({
                    access_permission: {
                        cleared_points: true
                    }
                })
                break;

            case "transactions":
                this.userAccountForm.patchValue({
                    access_permission: {
                        transactions: true
                    }
                })
                break;

            case "generate-file":
                this.userAccountForm.patchValue({
                    access_permission: {
                        generate_file: true
                    }
                })
                break;

            case "update-file":
                this.userAccountForm.patchValue({
                    access_permission: {
                        update_file: true
                    }
                })
                break;

            case "earning":
                this.userAccountForm.patchValue({
                    access_permission: {
                        earning: true
                    }
                })
                break;

            case "redeeming":
                this.userAccountForm.patchValue({
                    access_permission: {
                        redeeming: true
                    }
                })
                break;

            case "reports":
                this.userAccountForm.patchValue({
                    access_permission: {
                        reports: true
                    }
                })
                break;
            case "change-store":
                this.userAccountForm.patchValue({
                    access_permission: {
                        change_store: true
                    }
                })
                break;
        }
    }

    checkFormValueChanges() {
        this.userAccountForm.valueChanges.subscribe(() => {
            this.ifSomethingToChangeValue()
        })
    }

    ifSomethingToChangeValue() {
        this.convertAccessPermission()
        if (this.userAccountClone["first_name"] != this.userAccountForm.value["first_name"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.userAccountClone["last_name"] != this.userAccountForm.value["last_name"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.userAccountClone["username"] != this.userAccountForm.value["username"]) {
            this.btnAction = "Update";
            return true
        }

        if (this.userAccountClone["role"] != this.userAccountForm.value["role"]) {
            this.btnAction = "Update";
            return true
        }

        if (JSON.stringify(this.userAccountClone["access_permission"].split(", ")) != JSON.stringify(this.permissions.toString().split(","))) {
            this.btnAction = "Update";
            return true
        }
        else {
            this.btnAction = "Nothing to update";
            return false
        }

    }

    update() {
        this.convertAccessPermission()
        const { first_name, last_name, username, role } = this.userAccountForm.value;
        let updatedUserAccounts = {
            first_name,
            last_name,
            username,
            role,
            access_permission: this.permissions
        }
        this.dialog.open(UserAccountsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to update this user account?",
                action: "updateUserAccount",
                button_name: "Update",
                updatedUserAccounts,
                userId: this.userIdParams
            }
        })

    }

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
        if (update_file) {
            this.permissions.push("update-file")
        }
        if (reports) {
            this.permissions.push("reports")
        }
        if (change_store) {
            this.permissions.push("change-store")
        }
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
            }
        })
        this.permissions = []
        if (this.getRole() == this.roleQuery) {
            this.userAccountServices.getUserAccountById(this.userIdParams).subscribe(res => {
                const isOk = this.helperServices.isOk(res);
                if (isOk) {
                    const { body: { data: { user } } } = res;
                    const access_permission = user.access_permission.split(", ");
                    access_permission.map((access: string) => {
                        this.populatePermissionValue(access);
                    })
                    this.convertAccessPermission()
                }

            })
        }
    }

    getRole() {
        let { role } = this.userAccountForm.value;
        return role;
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
        if (this.ifSomethingToChangeValue()) {
            this.dialog.open(UserAccountsDialogComponent, {
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
            this.router.navigate(["/admin/user-accounts"])
        }

    }
}