import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CredServices } from "src/app/shared/services/cred.service";
import { MembersDialogComponent } from "../dialog/members.dialog.component";
import { MembersRegisterServices, TSteps } from "./members.register.service";

@Component({
  selector: 'app-members-register',
  templateUrl: './members.register.component.html',
  styleUrls: ['./members.register.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})


export class MembersRegisterComponent {

  constructor(
    public membersRegisterServices: MembersRegisterServices,
    private dialog: MatDialog,
    private router: Router,
    private credServices: CredServices
  ) { }

  handleKeyboardEvent(e: KeyboardEvent) {
    if (e.key == "Escape") {
      this.router.navigate(["/client/transactions"])
    }
  }

  getStoreName() {
    return this.credServices.getCredentials().activated_store.storeObject.name
  }

  stepTo(step: TSteps) {
    switch (step) {
      case 'Mobile Number':
        this.membersRegisterServices.steps = "Mobile Number";
        break;

      case 'Name':
        if (this.membersRegisterServices.can_access_layer == "Name") {
          this.membersRegisterServices.steps = "Name";
        }
        break;

      case 'Gender':
        if (this.membersRegisterServices.first_name.trim() != '' || this.membersRegisterServices.last_name.trim() != '') {
          this.membersRegisterServices.steps = "Gender";
        }
        break;

      case 'Birthday':
        if (this.membersRegisterServices.gender != '') {
          this.membersRegisterServices.steps = "Birthday";
        }
        break;

      case 'Address':
        if (this.membersRegisterServices.birthday != '') {
          this.membersRegisterServices.steps = "Address";
        }
        break;

      case 'Email':
        if (this.membersRegisterServices.province.trim() != '' && this.membersRegisterServices.municipality.trim() != '' && this.membersRegisterServices.barangay.trim() != '') {
          this.membersRegisterServices.steps = "Email";
        }
        break;

      case 'Working':
        if (this.membersRegisterServices.email != '') {
          this.membersRegisterServices.steps = "Working";
        }
        break;

      case 'Cooking':
        if (this.membersRegisterServices.working != '') {
          this.membersRegisterServices.steps = "Cooking";
        }
        break;

      case 'Overview':
        if (this.membersRegisterServices.cooking != '') {
          this.membersRegisterServices.steps = "Overview";
        }
        break;
    }
  }

  ngOnInit(): void {
    this.resetMemberForm()
    window.onbeforeunload = (e) => {
      e = e || window.event;
      if(e) {
        e.returnValue = 'Sure?'
      }
    }
  }

  back() {
    if (this.membersRegisterServices.buttonName == "CREATE") {
      this.dialog.open(MembersDialogComponent, {
        disableClose: true,
        data: {
          title: "Confirmation",
          question: "Changes you made may not be saved",
          button_name: 'Continue',
          action: 'return-to-transactions'
        }
      })
    }
    else {
      this.router.navigate(['/client/transactions'])
    }
  }

  resetMemberForm() {
    this.membersRegisterServices.mobile_number = '';
    this.membersRegisterServices.first_name = '';
    this.membersRegisterServices.last_name = '';
    this.membersRegisterServices.gender = '';
    this.membersRegisterServices.birthday = '';
    this.membersRegisterServices.province = '';
    this.membersRegisterServices.municipality = '';
    this.membersRegisterServices.barangay = '';
    this.membersRegisterServices.purok = '';
    this.membersRegisterServices.street_name = '';
    this.membersRegisterServices.email = '';
    this.membersRegisterServices.working = '';
    this.membersRegisterServices.cooking = '';
    this.membersRegisterServices.isMobileNumberExists = true;
    this.membersRegisterServices.validatedMobileNumber = '';
    this.membersRegisterServices.buttonName = "CREATE";
    this.membersRegisterServices.steps = "Mobile Number";
  }
}

