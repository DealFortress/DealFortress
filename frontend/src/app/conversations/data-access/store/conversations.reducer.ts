import { createReducer, on } from "@ngrx/store";
import { initialState } from "./conversations.state";
import { getMessagesError, getMessagesSuccess } from "./conversations.actions";

export const messagesReducer = createReducer(
    initialState,
    on(getMessagesSuccess,(state,action)=>{
        return {
            ...state,
            messages: action.messages,
            statusCode: action.statusCode
        }
    }),
    on(getMessagesError,(state,action)=>{
        return {
            ...state,
            errorMessage: action.errorText,
            statusCode: action.statusCode
        }
    }),
    // on(postMessageSuccess, (state, action) => {
    //     return {
    //         ...state,
    //     }
    // }),
    // on(postMessageError, (state, action) => {
    //     return {
    //         ...state,
    //     }
    // })
);
