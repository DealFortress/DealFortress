import { createReducer, on } from "@ngrx/store";
import { initialState, usersAdapter } from "./users.state";
import { loadLoggedInUserByAuthIdError,loadLoggedInUserByAuthIdSuccess, loadUserByIdError, 
    loadUserByIdSuccess, postUserError, postUserSuccess } from "./users.actions";


export const usersReducer = createReducer(
    initialState,
    on(loadUserByIdSuccess,(state,action)=>{
        return usersAdapter.addOne(action.user, {
            ...state,
            statusCode: action.statusCode
        });
    }),
    on(loadUserByIdError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            statusCode: action.statusCode
        }
    }),
    on(loadLoggedInUserByAuthIdSuccess,(state,action)=>{
        return usersAdapter.addOne(action.user, {
            ...state,
            loggedInUser: action.user,
            loggedInUserStatusCode: action.loggedInUserStatusCode
        });
    }),
    on(loadLoggedInUserByAuthIdError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            loggedInUserStatusCode: action.loggedInUserStatusCode
        }
    }),
    on(postUserSuccess, (state, action) => {
        return usersAdapter.addOne(action.user, {
            ...state,
            loggedInUser: action.user,
            loggedInUserStatusCode: action.loggedInUserStatusCode
        });
    }),
    on(postUserError, (state, action) => {
        return {
            ...state,
            errorMessage: action.errorText,
            loggedInUserStatusCode: action.loggedInUserStatusCode
        }
    })
);
