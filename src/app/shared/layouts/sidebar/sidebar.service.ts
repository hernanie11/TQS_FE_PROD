import { Injectable } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { Title } from "@angular/platform-browser";

@Injectable({
    providedIn: "root"
})

export class SidebarServices {
    constructor(
        private titleServices: Title
    ) { }
    dataSource = new MatTreeNestedDataSource<any>();

    Modules: any[] = [
        {
            name: 'Master list',
            childrens: [
                { name: 'User Accounts' },
                { name: 'Store Codes' },
                { name: 'Areas' },
                { name: 'Clusters' },
                { name: 'Business-Model' },
                { name: 'Stores' },
                { name: 'Members' }
            ],
        },
        {
            name: 'Transactions',
            childrens: [
                { name: 'Earned Points' },
                { name: 'Redeemed Points' },
                { name: 'Cleared Points' }
            ],
        },
        {
            name: 'Generate File / Update File',
            childrens: [
                { name: 'Generate File' },
                { name: 'Update File' }
            ],
        },
        {
            name: 'Reports',
            
        }
  
    ];


    menu: Imenu = {
        userAccounts: false,
        stores: false,
        store_codes: false,
        areas: false,
        clusters: false,
        business_model: false,
        members: false,
        earned_points: false,
        redeemed_points: false,
        cleared_points: false,
        transactions: false,
        generateFile: false,
        reports: false
    }

    userAccountSelected(routeModule: string) {

        switch (routeModule) {
            case "user-accounts":
                this.titleServices.setTitle(`TQS | User Accounts`)
                this.menu = {
                    userAccounts: true,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "stores":
                this.titleServices.setTitle(`TQS | Stores`)
                this.menu = {
                    userAccounts: false,
                    stores: true,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;

            case "store-codes":
                this.titleServices.setTitle(`TQS | Store Codes`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: true,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;


            case "areas":
                this.titleServices.setTitle(`TQS | Areas`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: true,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;

            case "clusters":
                this.titleServices.setTitle(`TQS | Clusters`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: true,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;

            case "business-model":
                this.titleServices.setTitle(`TQS | Business Model`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: true,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;

            case "members":
                this.titleServices.setTitle(`TQS | Members`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: true,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "earned-points":
                this.titleServices.setTitle(`TQS | Earned Points`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: true,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "redeemed-points":
                this.titleServices.setTitle(`TQS | Redeemed Points`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: true,
                    cleared_points: false,
                    transactions: true,
                    generateFile: false,
                    reports: false
                }
                break;

            case "cleared-points":
                this.titleServices.setTitle(`TQS | Cleared Points`)
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: true,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
                break;
            case "transactions":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: true,
                    generateFile: false,
                    reports: false
                }
                break;
            case "generate-file":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: true,
                    reports: false
                }
                break;
            case "reports":
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: true
                }
                break;
            default:
                this.menu = {
                    userAccounts: false,
                    stores: false,
                    store_codes: false,
                    areas: false,
                    clusters: false,
                    business_model: false,
                    members: false,
                    earned_points: false,
                    redeemed_points: false,
                    cleared_points: false,
                    transactions: false,
                    generateFile: false,
                    reports: false
                }
        }
    }
}

interface Imenu {
    userAccounts: boolean;
    stores: boolean;
    store_codes: boolean;
    areas: boolean;
    clusters: boolean;
    business_model: boolean;
    members: boolean;
    earned_points: boolean;
    redeemed_points: boolean;
    cleared_points: boolean;
    transactions: boolean;
    generateFile: boolean;
    reports: boolean;
}