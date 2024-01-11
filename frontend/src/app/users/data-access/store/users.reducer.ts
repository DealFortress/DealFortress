import { createReducer, on } from "@ngrx/store";
import { UsersState, initialState } from "./users.state";
import { loadUserByAuthIdError, loadUserByAuthIdRequest, loadUserByAuthIdSuccess, loadUserByIdError, loadUserByIdRequest, loadUserByIdSuccess, postUserError, postUserRequest, postUserSuccess } from "./users.actions";


export const usersReducer = createReducer(
    initialState,
    on(loadUserByIdSuccess,(state,action)=>{
        return {
            ...state,
            noticeOwner: action.user,
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
