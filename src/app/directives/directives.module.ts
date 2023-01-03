import { NgModule } from "@angular/core";
import { TitleCaseDirective } from "./input.capitalize.directive";
import { OnlyLetterDirective } from "./input.letter.only.directive";
import { OnlyNumberDirective } from "./input.number.only.directive";
import { TwoDigitDecimaNumberDirective } from "./input.two.decimal.place.only.directive";
import { UpperCaseDirective } from "./input.uppercase.directive";
import { NumberCommaDirective } from "./input.with.comma.directive";

@NgModule({
    declarations: [
        NumberCommaDirective,
        TitleCaseDirective,
        UpperCaseDirective,
        OnlyNumberDirective,
        OnlyLetterDirective,
        TwoDigitDecimaNumberDirective
    ],
    exports: [
        NumberCommaDirective,
        TitleCaseDirective,
        UpperCaseDirective,
        OnlyNumberDirective,
        OnlyLetterDirective,
        TwoDigitDecimaNumberDirective
    ]
})

export class DirectivesModule {

}