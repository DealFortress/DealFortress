import { Message } from "@app/shared/models/message";

import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";


export interface MessagesState extends EntityState<Message> {
    messages?: Message[],
    errorMessage?: string,
    statusCode?: number
}

export const messagesAdapter: EntityAdapter<Message> = createEntityAdapter<Message>({})

export const initialState : MessagesState = messagesAdapter.getInitialState({ errorMessage: '' });