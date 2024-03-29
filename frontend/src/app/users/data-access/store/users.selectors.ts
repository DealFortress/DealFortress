import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';


const getUsersState = createFeatureSelector<UsersState>('userState');
 
export const getLoggedInUser = createSelector(
    getUsersState,
    (state) => state.loggedInUser
);

export const getLoggedInUserId = createSelector(
    getUsersState,
    (state) => state.loggedInUser?.id
);

export const getErrorMessage = createSelector(
    getUsersState,
    (state) => state.errorMessage
)

export const getLoggedInUserStatusCode = createSelector(
    getUsersState,
    (state) => state.loggedInUserStatusCode
)


export const getUserById = (id: number) =>  createSelector(
    getUsersState,
    (state) => state.entities[id]
)
