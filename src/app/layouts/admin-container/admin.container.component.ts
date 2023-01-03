import { Component, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'app-admin-container',
    templateUrl: './admin.container.component.html',
    styleUrls: ['./admin.container.component.scss']
})

export class AdminContainerComponent {
    @Input() title: string = "";
}

