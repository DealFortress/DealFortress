import { Conversation } from "@app/shared/models/conversation/conversation.model";
import { Message } from "@app/shared/models/message/message";

import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";


export interface ConversationsState extends EntityState<Conversation> {
    conversations?: Conversation[],
    errorMessage?: string,
}

export const conversationsAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({})

export const initialState : ConversationsState = conversationsAdapter.getInitialState({ errorMessage: '' });