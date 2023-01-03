import { Directive, ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[UpperCase]'
})
export class UpperCaseDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('blur') onblur() {
    if (this.el.nativeElement.value) {
        this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase()
   }
  }
}