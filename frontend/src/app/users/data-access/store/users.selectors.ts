import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';
import { loadUserByIdRequest } from './users.actions';

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

// export const getorLoadUserById = (id: number, store : Store) =>  createSelector(
//     getUsersState,
//     (state) => {
//         const user = getUserById(state.);
//         if (user) {
//             return user
//         } else {
//             return store.dispatch(loadUserByIdRequest({id: id}))
//         }
//     }
// )