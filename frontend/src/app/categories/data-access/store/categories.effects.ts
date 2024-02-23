import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CategoriesApiService } from "../services/categories-api.service";
import { catchError, map, mergeMap } from "rxjs/operators";
import { loadCategoriesError, loadCategoriesRequest, loadCategoriesSuccess } from "./categories.actions";
import { of } from "rxjs";

@Injectable()
export class CategoriesEffects {

    constructor(
        private categoriesApiService: CategoriesApiService,
        private actions$: Actions,
        ) {}


    loadCategories$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadCategoriesRequest),
            mergeMap(() => {
                return this.categoriesApiService.getAllCategoriesAPI().pipe(
                    map((categories) => {
                        return (loadCategoriesSuccess({categories: categories}));
                    }),
                    catchError((_error) => {
                        return of(loadCategoriesError({errorText: _error.message}));
                    })
                );
            })
        );
    })
}
