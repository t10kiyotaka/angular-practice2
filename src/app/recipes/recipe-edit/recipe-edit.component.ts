import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  form: FormGroup;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  onSubmit() {
    const newRecipe = this.form.value;
    console.log(newRecipe);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe)
    } else {
      this.recipeService.addRecipe(newRecipe)
    }
    this.recipeService.getRecipes();
  }

  onClear() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {
    let name = '';
    let imagePath = '';
    let description = '';
    let ingredients = new FormArray([]);

    if(this.editMode) {
      this.store.select('recipes').pipe(map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id
        })
      })).subscribe(recipe => {
        name = recipe.name;
        imagePath = recipe.imagePath;
        description = recipe.description;
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            ingredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/[1-9]+[0-9]*/)
                ])
              })
            );
          }
        }
      });
    }

    this.form = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredients': ingredients
    });
  }

  get controls() {
    return (<FormArray>this.form.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.form.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(),
        'amount': new FormControl()
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.form.get('ingredients')).removeAt(index);
  }

}
