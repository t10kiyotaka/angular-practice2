import { Directive, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {
  constructor(viewContainerRef: ViewContainerRef) {}
}
