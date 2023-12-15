import { createReducer, on } from "@ngrx/store";
import { initialState } from "./conversations.state";
import { getConversationsError, getConversationsSuccess, getMessageSuccess, postMessageError, postMessageSuccess } from "./conversations.actions";
import { Conversation } from "@app/shared/models/conversation/conversation.model";

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

    on(getMessageSuccess, (state, action) => {
        return {
            ...state, 
            conversations: state.conversations?.map(conversation => {
                let updated: Conversation = {...conversation};
                if (conversation.id == action.message.conversationId) {
                    updated.messages = [...updated.messages, action.message];
                }
                return updated
            })
        }
    }),
    on(postMessageError, (state, action) => {
        return {
            ...state,
        }
    })
);
