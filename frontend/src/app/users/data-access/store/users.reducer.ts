import { createReducer, on } from "@ngrx/store";
import { UsersState } from "./users.state";
import { loadUserByAuthIdError, loadUserByAuthIdRequest, loadUserByAuthIdSuccess, loadUserByIdError, loadUserByIdRequest, loadUserByIdSuccess, postUserError, postUserRequest, postUserSuccess } from "./users.actions";

const initialState: UsersState = { }

export const usersReducer = createReducer(
    initialState,
    on(loadUserByIdSuccess,(state,action)=>{
        return {
            ...state,
            currentlyShownUser: action.user,
        }
    }),
    on(loadUserByIdError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText
        }
    }),
    on(loadUserByAuthIdSuccess,(state,action)=>{
        return {
            ...state,
            user: action.user,
        }
    }),
    on(loadUserByAuthIdError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText
        }
    }),
    on(postUserSuccess, (state, action) => {
        return {
            ...state,
            user: action.user
        }
    }),
    on(postUserError, (state, action) => {
        return {
            ...state,
            errorMessage: action.errorText
        }
    })
);