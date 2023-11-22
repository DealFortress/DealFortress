import { Category } from "@app/shared/models/category.model";
import { Status } from "@app/shared/models/state.model";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";

export interface CategoriesState extends EntityState<Category> {
    errorMessage: string,
    status: Status
}

export const categoriesAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({})

export const initialState : CategoriesState = categoriesAdapter.getInitialState({ errorMessage: '', status: Status.loading });