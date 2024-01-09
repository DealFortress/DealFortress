import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message';
import {MessageRequest } from '@app/shared/models/message/message-request';
import { createAction, props } from '@ngrx/store';

export const GET_MESSAGE_REQUEST = '[Messages] get message request';
export const GET_MESSAGE_SUCCESS = '[Messages] get message success';
export const GET_MESSAGE_ERROR = '[Messages] get message error';

export const POST_MESSAGE_REQUEST = '[Messages] post message';
export const POST_MESSAGE_SUCCESS = '[Messages] post message success';
export const POST_MESSAGE_ERROR = '[Messages] post message error';

export const GET_CONVERSATION_REQUEST = '[Conversations] get conversation request';
export const GET_CONVERSATION_SUCCESS = '[Conversations] get conversation success';
export const GET_CONVERSATION_ERROR = '[Conversations] get conversation error';

export const POST_CONVERSATION_REQUEST = '[Conversations] post conversation request';
export const POST_CONVERSATION_SUCCESS = '[Conversations] post conversation success';
export const POST_CONVERSATION_ERROR = '[Conversations] post conversation error';


export const getMessageSuccess = createAction(GET_MESSAGE_SUCCESS, props<{message : Message}>());
export const getMessageError = createAction(GET_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>());

export const postMessageRequest = createAction(POST_MESSAGE_REQUEST, props<{request: MessageRequest}>());
export const postMessageSuccess = createAction(POST_MESSAGE_SUCCESS, props<{message: Message, statusCode: number}>());
export const postMessageError = createAction(POST_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>());


export const getConversationsSuccess = createAction(GET_CONVERSATION_SUCCESS, props<{conversations : Conversation[]}>())
export const getConversationsError = createAction(GET_CONVERSATION_SUCCESS, props<{errorText: string}>())


