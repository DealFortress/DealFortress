import { ConversationRequest } from '@app/shared/models/conversation/conversation-request.model';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { PatchLastReadMessageRequest } from '@app/shared/models/conversation/patch-last-read-message-request.model';
import { MessageRequest } from '@app/shared/models/message/message-request.model';
import { Message } from '@app/shared/models/message/message.model';
import { createAction, props } from '@ngrx/store';

export const GET_MESSAGE_REQUEST = '[Messages] get message request';
export const GET_MESSAGE_SUCCESS = '[Messages] get message success';
export const GET_MESSAGE_ERROR = '[Messages] get message error';

export const POST_MESSAGE_REQUEST = '[Messages] post message request';
export const POST_MESSAGE_SUCCESS = '[Messages] post message success';
export const POST_MESSAGE_ERROR = '[Messages] post message error';

export const GET_CONVERSATION_REQUEST = '[Conversations] get conversation request';
export const GET_CONVERSATION_SUCCESS = '[Conversations] get conversation success';
export const GET_CONVERSATION_ERROR = '[Conversations] get conversation error';

export const GET_CONVERSATIONS_REQUEST = '[Conversations] get conversations request';
export const GET_CONVERSATIONS_SUCCESS = '[Conversations] get conversations success';
export const GET_CONVERSATIONS_ERROR = '[Conversations] get conversations error';

export const POST_CONVERSATION_REQUEST = '[Conversations] post conversation request';
export const POST_CONVERSATION_SUCCESS = '[Conversations] post conversation success';
export const POST_CONVERSATION_ERROR = '[Conversations] post conversation error';

export const PATCH_CONVERSATION_LAST_READ_MESSAGE_REQUEST = '[Conversations] patch conversation last read message request';
export const PATCH_CONVERSATION_LAST_READ_MESSAGE_SUCCESS = '[Conversations] patch conversation last read message success';
export const PATCH_CONVERSATION_LAST_READ_MESSAGE_ERROR = '[Conversations] patch conversation last read message error';




export const getMessageSuccess = createAction(GET_MESSAGE_SUCCESS, props<{message : Message}>());
export const getMessageError = createAction(GET_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>());

export const postMessageRequest = createAction(POST_MESSAGE_REQUEST, props<{request: MessageRequest}>());
export const postMessageSuccess = createAction(POST_MESSAGE_SUCCESS, props<{message: Message, statusCode: number}>());
export const postMessageError = createAction(POST_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>());

export const getConversationsSuccess = createAction(GET_CONVERSATIONS_SUCCESS, props<{conversations : Conversation[]}>())
export const getConversationsError = createAction(GET_CONVERSATIONS_SUCCESS, props<{errorText: string}>())

export const getConversationSuccess = createAction(GET_CONVERSATION_SUCCESS, props<{conversation : Conversation}>());
export const getConversationError = createAction(GET_CONVERSATION_ERROR, props<{errorText: string, statusCode: number}>());

export const postConversationRequest = createAction(POST_CONVERSATION_REQUEST, props<{request: ConversationRequest}>());
export const postConversationSuccess = createAction(POST_CONVERSATION_SUCCESS, props<{conversation: Conversation, statusCode: number}>());
export const postConversationError = createAction(POST_CONVERSATION_ERROR, props<{errorText: string, statusCode: number}>());

export const patchLastReadMessageRequest = createAction(PATCH_CONVERSATION_LAST_READ_MESSAGE_REQUEST, props<{request: PatchLastReadMessageRequest}>())
export const patchLastReadMessageSuccess = createAction(PATCH_CONVERSATION_LAST_READ_MESSAGE_SUCCESS, props<{conversation: Conversation, statusCode: number}>())
export const patchLastReadMessageError = createAction(PATCH_CONVERSATION_LAST_READ_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>())


