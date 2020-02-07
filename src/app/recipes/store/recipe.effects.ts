import * as RecipesActions from './recipe.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from '../../shared/ingredient.model';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      const url = 'https://ng-cookbook-98692.firebaseio.com/recipes.json';
      return this.http.get<Recipe[]>(url)
    }),
    map(recipes => {
      return recipes.map(recipe => {
        const ingredients: Ingredient[] = recipe.ingredients ? recipe.ingredients : [];
        return {...recipe, ingredients: ingredients}
      })
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
