import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessagesState } from './messages.state';

const getMessagesState = createFeatureSelector<MessagesState>('messagesState');
 
export const connectToMessageHub = createSelector(
    getMessagesState,
    (state) => state.messages
);
