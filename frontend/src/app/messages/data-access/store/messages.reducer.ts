import { createReducer, on } from "@ngrx/store";
import { initialState } from "./messages.state";
import { getMessagesError, getMessagesSuccess } from "./messages.actions";

export const messagesReducer = createReducer(
    initialState,
    on(getMessagesSuccess,(state,action)=>{
        return {
            ...state,
        }
    }),
    on(getMessagesError,(state,action)=>{
        return {
            ...state,
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
