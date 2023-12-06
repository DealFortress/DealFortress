import { createReducer, on } from "@ngrx/store";
import { initialState } from "./messages.state";
import { connectToMessageHubError, connectToMessageHubSuccess } from "./messages.actions";

export const messagesReducer = createReducer(
    initialState,
    on(connectToMessageHubSuccess,(state,action)=>{
        return {
            ...state,
        }
    }),
    on(connectToMessageHubError,(state,action)=>{
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
