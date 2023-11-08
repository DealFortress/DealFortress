import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

const getUsersState = createFeatureSelector<UsersState>('userState');
 
export const getUser = createSelector(
    getUsersState,
    (state) => state.user
);

export const getUserId = createSelector(
    getUsersState,
    (state) => state.user?.id
);

export const getErrorMessage = createSelector(
    getUsersState,
    (state) => state.errorMessage
)

export const getStatusCode = createSelector(
    getUsersState,
    (state) => state.statusCode
)

export const getCurrentlyShownUser =  createSelector(
    getUsersState,
    (state) => state.currentlyShownUser
)