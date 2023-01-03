import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { AppServices } from './app.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { LocalService } from './shared/services/local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private appServices : AppServices,
    private dialog: MatDialog,
    private update: SwUpdate,
    private localService: LocalService
  ) {}

  // @HostListener("window:onbeforeunload",["$event"])
  // clearLocalStorage(event: any){
  //   localStorage.clear();
  // }

  ngOnInit(): void {
    this.appServices.createOnline$().subscribe(isOnline => {
      this.appServices.internetForm.setValue({isOnline})
      if(!isOnline) {
        this.dialog.open(DialogComponent, {
          disableClose: true,
          data: {
            title: "Notification!",
            content: "No Internet Connection!...",
          }
        })
      }
    })

    this.updateClient()
    
  }  

  clearToken(){
  }

  updateClient() {
    if(this.update.isEnabled) {
      this.update.checkForUpdate().then(res => {
        if(res) {
          if(confirm('There is a new update')) {
            this.update.activateUpdate().then(() => location.reload()) 
          }
        }
      })
    }
    
  }

  
}