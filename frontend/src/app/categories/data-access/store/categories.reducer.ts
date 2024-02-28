import { createReducer, on } from "@ngrx/store";
import { loadCategoriesError, loadCategoriesRequest, loadCategoriesSuccess } from "./categories.actions";
import { Status } from "@app/shared/models/state.model";
import { categoriesAdapter, initialState } from "./categories.state";

export const categoriesReducer = createReducer(
    initialState,
    on(loadCategoriesRequest, (state) => {
        return {
            ...state,
            status: Status.loading
        };
    }),
    on(loadCategoriesSuccess,(state,action)=>{
        return categoriesAdapter.setAll(action.categories,{
            ...state,
            status: Status.success,
          });
    }),
    on(loadCategoriesError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
);
