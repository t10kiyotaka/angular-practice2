import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) form: NgForm;
  subscription: Subscription;
  editItemIndex: number;
  isEditMode = false;
  editItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startEditing
      .subscribe(
        (index: number) => {
          this.editItemIndex = index;
          this.isEditMode = true;
          this.editItem = this.shoppingListService.getIngredient(index);
          this.form.setValue({
            'name': this.editItem.name,
            'amount': this.editItem.amount
          })
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.isEditMode) {
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient)
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.isEditMode = false;
    this.form.reset();
  }

  onClear() {
    this.form.reset();
    this.isEditMode = false;
  }

}
