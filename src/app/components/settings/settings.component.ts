import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DeviceDetectorService } from 'ngx-device-detector';
import { SettingsDialogComponent } from "./dialog/settings.dialog.component";
import { SettingsServices } from "./settings.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {
    constructor(
        private deviceService: DeviceDetectorService,
        private settingsServices: SettingsServices,
        private dialog: MatDialog
    ) { }

    title: string = "Settings";
    isComputionEdit: boolean = false;
    earningPointsPercentage: any;
    currentEarningPointsPercentage: any;
    exampleBoughtAmount: number = 200;

    earnedAmount() {
        return this.exampleBoughtAmount * this.earningPointsPercentage;
    }
    editComputation() {
        this.isComputionEdit = true;
    }

    okComputation() {
        this.isComputionEdit = false;
    }
    panelOpenState = false;
    remarks: string = "";

    deviceInfo: any = null;

    

    ngOnInit(): void {
        this.getEarningPointsPercentage()
    }

    epicFunction() {
    }

    getEarningPointsPercentage() {
        this.settingsServices.getEarningPointsPercentage().subscribe(res => {
            const { earning_percentage } = res;
            this.currentEarningPointsPercentage = earning_percentage;
            this.earningPointsPercentage = earning_percentage;
        })
    }

    validateSave() {
        if (this.earningPointsPercentage != this.currentEarningPointsPercentage && this.remarks != "" && !this.isComputionEdit) {
            return true;
        }
        return false;
    }

    validateRemarks() {
        if(this.earningPointsPercentage != this.currentEarningPointsPercentage) {
            return true;
        }
        return false;
    }

    validateOk() {
        if(this.currentEarningPointsPercentage != this.earningPointsPercentage) {
            if(this.remarks == "" || Number(this.earningPointsPercentage) <= 0) {
                return true
            }
            return false;
        }
        return false;
    }

    cancel() {
        this.earningPointsPercentage = this.currentEarningPointsPercentage;
        this.remarks = "";
    }

    save() {
        this.dialog.open(SettingsDialogComponent, {
            disableClose: true,
            data: {
                title: "Confirmation",
                question: "Are you sure you want to save this earning points percentage?",
                action: "SaveSetting",
                button_name: 'Save',
                settings: {
                    earningPointsPercentage: this.earningPointsPercentage,
                    remarks: this.remarks
                }
            }
        }).afterClosed().subscribe(dialogResponse => {
            const { updated_percentage } = dialogResponse;
            this.currentEarningPointsPercentage = updated_percentage;
        })
    }
}