import { Component } from "@angular/core";
import { AppServices } from "src/app/app.service";
import { CredServices } from "src/app/shared/services/cred.service";
import { ThemePalette } from '@angular/material/core';
import { GenerateFileClientService } from "./generate.file.client.service";
import { HelperServices } from "src/app/shared/services/helpers.service";
const CryptoJS = require("crypto-js");
@Component({
  selector: 'app-generate-file-client',
  templateUrl: './generate.file.client.component.html',
  styleUrls: ['./generate.file.client.component.scss']
})

export class GenerateFileClientComponent {

  constructor(
    private credServices: CredServices,
    public appServices: AppServices,
    private generateFileClientServices: GenerateFileClientService,
    private helpersServices: HelperServices
  ) { }
  getStoreName() {
    return this.credServices.getCredentials().activated_store.storeObject.name
  }

  

  task: Task = {
    name: 'Select All',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Members', completed: false, color: 'primary' },
      { name: 'Earned Points', completed: false, color: 'accent' },
      // { name: 'Warn', completed: false, color: 'warn' },
    ],
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  generateFile() {
    this.generateFileClientServices.generateFile().subscribe(res => {
      const updatedDatabaseCyper: any = CryptoJS.AES.encrypt(JSON.stringify(res), this.credServices.secretKey).toString()

      let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
      const fileName = `Generate File - StoreName: ${this.getStoreName()} ${dateToday}`
      this.helpersServices.exportJsonData([updatedDatabaseCyper], fileName)
    })
  }
}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
