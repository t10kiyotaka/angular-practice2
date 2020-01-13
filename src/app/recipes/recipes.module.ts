import { NgModule } from '@angular/core';
import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from '../auth/recipes-routing.module';


const RECIPES_MODULE = [
  RecipesComponent,
  RecipeListComponent,
  RecipeDetailComponent,
  RecipeItemComponent,
  RecipeStartComponent,
  RecipeEditComponent,
];


@NgModule({
  declarations: [...RECIPES_MODULE],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RecipesRoutingModule
  ],
  exports: [...RECIPES_MODULE]
})
export class RecipesModule {

}
