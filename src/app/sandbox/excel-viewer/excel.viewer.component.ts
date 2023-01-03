import { Component } from "@angular/core";
import * as XLSX from 'xlsx';
@Component({
    selector:' app-excel-viewer',
    templateUrl: './excel.viewer.component.html',
    styleUrls: ['./excel.viewer.component.scss']
})

export class ExcelViewerComponent {
            
    excelData: any[] = []
    fileUpload(event: any) {
        alert(`hi`)
        const selectedFile = event.target.files[0]
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => { 
            let binaryData = event.target?.result;
            let workbook = XLSX.read(binaryData, { type: "binary" })
            workbook.SheetNames.forEach(sheet => {
                this.excelData.push({
                    sheetName: sheet,
                    data: XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                })
            })

            console.log(this.excelData)
          
            // console.log(workbook)
        }
    }
}