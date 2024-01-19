import { createReducer, on } from "@ngrx/store";
import { conversationsAdapter, initialState } from "./conversations.state";
import { getConversationSuccess, getConversationsError, getConversationsSuccess, getMessageSuccess, postConversationSuccess, postMessageError, postMessageSuccess } from "./conversations.actions";
import { Conversation } from "@app/shared/models/conversation/conversation.model";
import { Status } from "@app/shared/models/state.model";

export const conversationsReducer = createReducer(
    initialState,
    on(getConversationsSuccess,(state,action)=>{
        return conversationsAdapter.setAll(action.conversations, {
            ...state,
            status: Status.success
        })
    }),
    
    on(getConversationsError,(state,action)=>{
        return {
            ...state,
            errorMessage: action.errorText,
        }
    }),
    on(getMessageSuccess, (state, action) => {  

        const conversation = state.entities[action.message.conversationId]
            let updatedConversation = {...conversation!};
            updatedConversation.messages = [...updatedConversation.messages, action.message];               
            return conversationsAdapter.upsertOne(updatedConversation,state);
    }),

    on(getConversationSuccess, (state, action) => {
       if (action.conversation == undefined) {
        return state;
       }
       return conversationsAdapter.addOne(action.conversation, {
        ...state,
        })
    }),

    on(postMessageError, (state, action) => {
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    })
);
