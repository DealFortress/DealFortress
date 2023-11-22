import { createFeatureSelector, createSelector} from '@ngrx/store';
import { CategoriesState, categoriesAdapter } from './categories.state';

const getCategoriesState = createFeatureSelector<CategoriesState>('categoriesState');
 
const { selectAll } = categoriesAdapter.getSelectors();

export const getCategories = createSelector(
    getCategoriesState,
    selectAll
);

export const getCategoryById = (id: number) =>  createSelector(
    getCategoriesState,
    state => state.entities[id]
)