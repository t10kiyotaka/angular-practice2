import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const SHOPPING_LISTS_MODULE = [
  ShoppingListComponent,
  ShoppingEditComponent,
];

@NgModule({
  declarations: [...SHOPPING_LISTS_MODULE],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'shopping-list', component: ShoppingListComponent }
    ]),
  ]
})
export class ShoppingListModule {

}
