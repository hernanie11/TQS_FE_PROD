import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: "root"
})

export class AppServices {
    constructor(
        private fb: FormBuilder
    ) {}
    internetForm: FormGroup = this.fb.group({
        isOnline: []
    })
    createOnline$() {
        return merge<boolean>(
            fromEvent(window, 'offline').pipe(map(() => false)),
            fromEvent(window, 'online').pipe(map(() => true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(navigator.onLine);
                sub.complete();
            }));
    }

    isServerStarted: boolean = false;
}