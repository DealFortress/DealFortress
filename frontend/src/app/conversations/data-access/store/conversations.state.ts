import { Conversation } from "@app/shared/models/conversation/conversation.model";
import { Message } from "@app/shared/models/message/message";
import { Status } from "@app/shared/models/state.model";

import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";


export interface ConversationsState extends EntityState<Conversation> {
    errorMessage?: string,
    status: Status
}

export const conversationsAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({})

export const initialState : ConversationsState = conversationsAdapter.getInitialState({ errorMessage: '', status: Status.loading});