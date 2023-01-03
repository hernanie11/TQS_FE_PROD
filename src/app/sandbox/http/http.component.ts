import { Component } from "@angular/core";
import { concat, fromEvent, interval, merge, Observable, of, timer, zip } from "rxjs";
import { HttpService } from "./http.service";
import { BehaviorSubject } from 'rxjs'
import { first, take, takeUntil, takeWhile } from 'rxjs/operators'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
const _ = require("lodash");
@Component({
    selector: 'app-http',
    templateUrl: './http.component.html',
    styleUrls: ['./http.component.scss']
})

export class HttpComponent {
    constructor(
        private httpService: HttpService,
        private fb: FormBuilder
    ) {}


    ids: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    
    subject = new BehaviorSubject(123);
    methods$: Observable<any>

    count: number = 0;
    status: boolean = false;
    clicks = fromEvent(document, 'click');
    counter = interval(1000).pipe(takeWhile(() => this.status == false))

    ngOnInit(): void {
        this.counter.subscribe(count => this.count = count)
    }

    stop() {
        this.status = true;
    }
    
    loginForm: FormGroup = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', Validators.required]
    })

    login() {
        console.log(this.loginForm.value)
    }

    setValue() {
        console.log(this.loginForm)
    }
}