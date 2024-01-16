import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

const getUsersState = createFeatureSelector<UsersState>('userState');
 
export const getLoggedInUser = createSelector(
    getUsersState,
    (state) => state.user
);

export const getLoggedInUserId = createSelector(
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

export const getNoticeOwner =  createSelector(
    getUsersState,
    (state) => state.noticeOwner
)