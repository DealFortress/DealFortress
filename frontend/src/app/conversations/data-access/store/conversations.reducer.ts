import { createReducer, on } from "@ngrx/store";
import { initialState } from "./conversations.state";
import { getConversationsError, getConversationsSuccess, getMessagesError, getMessagesSuccess } from "./conversations.actions";

export const conversationsReducer = createReducer(
    initialState,
    on(getConversationsSuccess,(state,action)=>{
        return {
            ...state,
            conversations: action.conversations,
        }
    }),
    on(getConversationsError,(state,action)=>{
        return {
            ...state,
            errorMessage: action.errorText,
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
