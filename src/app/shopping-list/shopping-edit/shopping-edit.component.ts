import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';

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

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }

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
      // this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(
        { index: this.editItemIndex, ingredient: newIngredient })
      )
    } else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));

    }
    this.isEditMode = false;
    this.form.reset();
  }

  onDelete() {
    this.onClear();
    // this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editItemIndex));
  }

  onClear() {
    this.form.reset();
    this.isEditMode = false;
  }


}
