import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HelperServices } from "src/app/shared/services/helpers.service";
import exportFromJSON from 'export-from-json'
import * as moment from "moment";
import { asyncScheduler, from, Observable, of, Subject, Subscription } from "rxjs";
import { concatMap, delay } from "rxjs/operators";
import { TStudentInput } from "../child/child.component";
import { ExcelWithPasswordService } from "./excel-with-password.service";
const CryptoJS = require("crypto-js");
@Component({
    selector: 'app-sandbox-excel-with-password',
    templateUrl: './excel-with-password.component.html',
    styleUrls: ['./excel-with-password.component.scss']
})

export class ExcelWithPasswordComponent {
    constructor(
        private fb: FormBuilder,
        private excelWithPasswordService: ExcelWithPasswordService
    ) { }

    employees: any = [
        {
            id: 1,
            name: "phil",
            salary: 10000
        },
        {
            id: 2,
            name: "josh",
            salary: 5000
        },
    ]

    data = [
        { member_id: 21, transaction_no: "4", amount: 200, points_earn: 20, transaction_datetime: moment().format("yyyy-M-D hh:mm:ss") },
    ]

    details = {
        dateGenerated: new Date(Date.now()).toLocaleDateString(),
        timeGenerated: new Date(Date.now()).toLocaleDateString()
    }

    export() {
        var earnedPointsCyper = CryptoJS.AES.encrypt(JSON.stringify(this.data), 'secret key 123').toString();
        var detailsCyper = CryptoJS.AES.encrypt(JSON.stringify(this.details), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(earnedPointsCyper, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        let data = [
            earnedPointsCyper,
            detailsCyper
        ]

        let dateToday = `date: ${new Date(Date.now()).toLocaleDateString()} time: ${new Date(Date.now()).toLocaleTimeString()}`
        // console.log(`date today`, dateToday)
        console.log()
        const fileName = `Earned Points - ${dateToday}`
        const exportType = 'json'
        exportFromJSON({ data, fileName, exportType })
    }


    loginForm: FormGroup = this.fb.group({
        username: ["", Validators.required],
        password: ["", Validators.required]
    })

    login() {
        alert(`logged in`)
    }

    loginValidation() {
        if (!this.loginForm.valid) {
            return true
        }
        return false;
    }

    numbers = [1, 2, 3];
    uploadedNumber: number = 0;
    sample = new Subject()
    sampleObservable = new Observable(subs => {
        subs.next("Jose for approval"),
        setTimeout(() => {
            subs.next("vilo for approval")
        }, 1000)
        
    })

    numberss: number[] = [1,3,3,123,123,133,131,2312,3123,123,123,123,21];
    ngOnInit(): void {
        // from(this.numbers).pipe(
        //     concatMap(val => of(val).pipe(delay(500)))
        // ).subscribe({
        //     next: (num) => {
        //         console.log(num)
        //         this.uploadedNumber++;
        //         if(this.numbers.length == this.uploadedNumber) {
        //             setTimeout(() => {
        //                 this.sample.complete()
        //             }, 1000);
        //         }
        //     },
        //     complete: () => {
                
        //         this.sample.subscribe({
        //             next: (emit) => console.log(`emit`, emit),
        //             complete: () => console.log(`done`)
        //         })

        //     }
        // })

        // console.log(Array(100))
        // this.excelWithPasswordService.getPosts().subscribe({
        //     next: (response) => {
        //         console.log(response)
        //     },
        //     complete: () => console.log(`done`)
        // })

        // this.sampleObservable.subscribe({
        //     next: (response) => console.log(response),
        //     complete: () => console.log(`done`)
        // })

        

    }



    
    student1:TStudentInput  = {
        fname: "Hernanie",
        lname: "Pabustan",
        age: 30
    }
    cars: string[] = ["toyota", "honda"]

    students: any[] = [
        {
            fname: "Hernanie",
            lname: "Pabustan",
            age: 30
        },
        {
            fname: "Limay",
            lname: "Pabustan",
            age: 30
        }
    ]




    
    // posts$: Observable<any> = this.excelWithPasswordService.getPosts()
    
  
}



