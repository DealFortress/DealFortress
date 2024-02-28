import { createReducer, on } from "@ngrx/store";
import { conversationsAdapter, initialState } from "./conversations.state";
import { getConversationError, getConversationSuccess, getConversationsError, getConversationsSuccess, getMessageError, getMessageSuccess, getUpdatedConversationError, getUpdatedConversationSuccess, postConversationError,  postMessageError} from "./conversations.actions";
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
        const updatedConversation = {...conversation!};
        updatedConversation.messages = [...updatedConversation.messages, action.message];               
        return conversationsAdapter.upsertOne(updatedConversation,state);
    }),
    on(getMessageError,(state,action)=>{
        return {
            ...state,
            errorMessage: action.errorText,
        }
    }),
    on(getConversationSuccess, (state, action) => {
       if (action.conversation == undefined) {
        return state;
       }
       if (state.entities[action.conversation.id]) {
        return conversationsAdapter.upsertOne(action.conversation, {...state})
       }
       return conversationsAdapter.addOne(action.conversation, {...state})
    }),
    on(getConversationError,(state,action)=>{
        return {
            ...state,
            errorMessage: action.errorText,
        }
    }),
    on(getUpdatedConversationSuccess, (state, action) => {
       if (action.conversation == undefined) {
        return state;
       }
       return conversationsAdapter.upsertOne(action.conversation, {...state})
    }),
    on(getUpdatedConversationError,(state,action)=>{
        return {
            ...state,
            errorMessage: action.errorText,
        }
    }),
     on(postConversationError,(state, action) => {
        return {
            ...state,
            errorMessage: action.errorText,
        }
     }),
    on(postMessageError, (state, action) => {
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),

);
