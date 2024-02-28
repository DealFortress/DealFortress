import { convertDateToMinutes } from "@app/shared/helper-functions/helper-functions";
import { Conversation } from "@app/shared/models/conversation/conversation.model";
import { Status } from "@app/shared/models/state.model";

import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";


export interface ConversationsState extends EntityState<Conversation> {
    errorMessage?: string,
    status: Status
}

export const sortByLatestMessage = (a: Conversation, b: Conversation) => {
    return convertDateToMinutes(b.messages[-1].createdAt) - convertDateToMinutes(a.messages[-1].createdAt) 
}


export const conversationsAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({
    sortComparer: sortByLatestMessage
})

export const initialState : ConversationsState = conversationsAdapter.getInitialState({ errorMessage: '', status: Status.loading});