import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConversationsState } from './conversations.state';

const getConversationsState = createFeatureSelector<ConversationsState>('conversationsState');
 
export const getConversations = createSelector(
    getConversationsState,
    (state) => state.conversations
);
