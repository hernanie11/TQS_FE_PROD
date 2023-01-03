import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { CredServices } from '../../services/cred.service';
import { SidebarServices } from './sidebar.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    public sideBarServices: SidebarServices,
    public credServices: CredServices,
    private router: Router

  ) {

  }

  checkAccess(accessParam: string) {
    let { user: { access_permission } } = this.credServices.getCredentials()
    let hasAccess = access_permission.some((access: string) => access == accessParam)
    return hasAccess
  }

  goTo(route: string) {
    switch (route) {
      case 'User Accounts':
        this.router.navigate(['/admin/user-accounts'])
        break;
      case 'Branch Codes':
        this.router.navigate(['/admin/store-codes'])
        break;
      case 'Areas':
        this.router.navigate(['/admin/areas'])
        break;
      case 'Regions':
        this.router.navigate(['/admin/regions'])
        break;
      case 'Clusters':
        this.router.navigate(['/admin/clusters'])
        break;
      case 'Business Model':
        this.router.navigate(['/admin/business-model'])
        break;
      case 'Stores':
        this.router.navigate(['/admin/stores'])
        break;
      case 'Members':
        this.router.navigate(['/admin/members'])
        break;
      case 'Addresses':
        this.router.navigate(['/admin/addresses'])
        break;
      case 'Earned Points':
        this.router.navigate(['/admin/earned-points'])
        break;
      case 'Redeemed Points':
        this.router.navigate(['/admin/redeemed-points'])
        break;
      case 'Cleared Points':
        this.router.navigate(['/admin/cleared-points'])
        break;
      case 'Generate File':
        this.router.navigate(['/admin/generate-file'])
        break;
      case 'Update File':
        this.router.navigate(['/admin/update-file'])
        break;
      case 'Reports':
        this.router.navigate(['/admin/reports'])
        break;

    }

  }

  treeControl = new NestedTreeControl<any>(node => node.childrens);

  hasChild = (_: number, node: any) => !!node.childrens && node.childrens.length > 0;

  ngOnInit(): void {
    let { user: { access_permission } } = this.credServices.getCredentials()

    let sidebarModules: any = [
      {
        name: 'Master list'
      },
      // {
      //   name: 'Transactions',
      //   childrens: [
      //     { name: 'Earned Points' },
      //     { name: 'Redeemed Points' },
      //     { name: 'Cleared Points' }
      //   ]
      // },
      // {
      //   name: 'Generate File / Update File',
      //   childrens: [
      //     { name: 'Generate File' },
      //     { name: 'Update File' }
      //   ]
      // }
    ]
    let masterlist_childrens: any = []
    let transaction_childrens: any = []
    let file_childrens: any = []

    if(access_permission.includes('earned-points') 
    || access_permission.includes('redeemed-points') 
    || access_permission.includes('cleared-points')) 
    {
      sidebarModules.push({name: "Transactions"})
    }
    
    if(access_permission.includes('generate-file') || access_permission.includes('update-file')) {
      sidebarModules.push({name: "Generate File / Update File"})
    }
  
    if(access_permission.includes('reports')) {
      sidebarModules.push({name: "Reports"})
    }


    access_permission.map((access: string) => {
      if (access == "user-accounts") masterlist_childrens.push({ name: "User Accounts" })
      if (access == "stores") {
        masterlist_childrens.push({ name: "Branch Codes" })
        masterlist_childrens.push({ name: "Areas" })
        masterlist_childrens.push({ name: "Regions" })
        masterlist_childrens.push({ name: "Clusters" })
        masterlist_childrens.push({ name: "Business Model" })
        masterlist_childrens.push({ name: "Stores" })
      }
      if (access == "members") masterlist_childrens.push({ name: "Members" })
      if (access == "earned-points") transaction_childrens.push({ name: "Earned Points" })
      if (access == "redeemed-points") transaction_childrens.push({ name: "Redeemed Points" })
      if (access == "cleared-points") transaction_childrens.push({ name: "Cleared Points" })
      if (access == "generate-file") file_childrens.push({ name: "Generate File"})
      if (access == "update-file") file_childrens.push({ name: "Update File"})
     
    
    })
    masterlist_childrens.push({ name: "Addresses" })

    sidebarModules.map((module: any) => {
      if (module.name == "Master list") module.childrens = masterlist_childrens
      if (module.name == "Transactions") module.childrens = transaction_childrens
      if (module.name == "Generate File / Update File") module.childrens = file_childrens
   
      
    })

   


    this.sideBarServices.dataSource.data = sidebarModules
  }

}

const Modules: any[] = [
  {
    name: 'Master list',
    // childrens: [
    //   { name: 'User Accounts' },
    //   { name: 'Branch Codes' },
    //   { name: 'Areas' },
    //   { name: 'Regions' },
    //   { name: 'Clusters' },
    //   { name: 'Business-Model' },
    //   { name: 'Stores' },
    //   { name: 'Members' },
    // ],
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
  
  // {
  //   name: 'Reports',
   
  // }
];



// interface FoodNode {
//   name: string;
//   children?: FoodNode[];
// }