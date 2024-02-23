import { Category } from "@app/shared/models/category.model";
import { createAction, props } from "@ngrx/store";


export const LOAD_CATEGORIES_REQUEST = '[Categories] load categories request';
export const LOAD_CATEGORIES_SUCCESS = '[Categories] load categories success';
export const LOAD_CATEGORIES_ERROR = '[Categories] load categories error';



export const loadCategoriesRequest = createAction(LOAD_CATEGORIES_REQUEST);
export const loadCategoriesSuccess = createAction(LOAD_CATEGORIES_SUCCESS, props<{categories: Category[]}>());
export const loadCategoriesError = createAction(LOAD_CATEGORIES_ERROR, props<{errorText: string}>());

