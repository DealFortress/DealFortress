import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessagesState } from './conversations.state';

const getMessagesState = createFeatureSelector<MessagesState>('messagesState');
 
export const getMessages = createSelector(
    getMessagesState,
    (state) => state.messages
);
