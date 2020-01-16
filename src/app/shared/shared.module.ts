import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';


const SHARED_MODULE = [
  AlertComponent,
  LoadingSpinnerComponent,
  PlaceholderDirective,
  DropdownDirective,
];

@NgModule({
  declarations: [...SHARED_MODULE],
  exports: [
    ...SHARED_MODULE,
    CommonModule
  ]
})
export class SharedModule {

}
