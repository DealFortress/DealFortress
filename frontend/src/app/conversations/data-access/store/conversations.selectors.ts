import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConversationsState, conversationsAdapter } from './conversations.state';

const getConversationsState = createFeatureSelector<ConversationsState>('conversationsState');
 
const { selectAll } = conversationsAdapter.getSelectors();


export const getConversations = createSelector(
    getConversationsState,
    selectAll
);

export const getConversationById = (id: number) =>  createSelector(
    getConversationsState,
    state => state.entities[id]
);
