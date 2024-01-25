import { createReducer, on } from "@ngrx/store";
import { UsersState, initialState, usersAdapter } from "./users.state";
import { loadUserByAuthIdError,loadUserByAuthIdSuccess, loadUserByIdError, loadUserByIdRequest, loadUserByIdSuccess, postUserError, postUserRequest, postUserSuccess } from "./users.actions";


export const usersReducer = createReducer(
    initialState,
    on(loadUserByIdSuccess,(state,action)=>{
        return usersAdapter.addOne(action.user, {
            ...state,
        });
    }),
    on(loadUserByIdError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText
        }
    }),
    on(loadUserByAuthIdSuccess,(state,action)=>{
        return usersAdapter.addOne(action.user, {
            ...state,
            loggedInUser: action.user
        });
    }),
    on(loadUserByAuthIdError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText
        }
    }),
    on(postUserSuccess, (state, action) => {
        return usersAdapter.addOne(action.user, {
            ...state,
            loggedInUser: action.user
        });
    }),
    on(postUserError, (state, action) => {
        return {
            ...state,
            errorMessage: action.errorText
        }
    })
);
