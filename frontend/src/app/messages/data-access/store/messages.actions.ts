import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message';
import {MessageRequest } from '@app/shared/models/message/message-request';
import { createAction, props } from '@ngrx/store';

export const GET_MESSAGES_REQUEST = '[Messages] connect to message hub request';
export const GET_MESSAGES_SUCCESS = '[Messages] connect to message hub success';
export const GET_MESSAGES_ERROR = '[Messages] connect to message hub error';


export const POST_MESSAGE_REQUEST = '[Messages] post message';
export const POST_MESSAGE_SUCCESS = '[Messages] post message success';
export const POST_MESSAGE_ERROR = '[Messages] post message error';

export const GET_CONVERSATION_REQUEST = '[Conversations] get conversation request';
export const GET_CONVERSATION_SUCCESS = '[Conversations] get conversation success';
export const GET_CONVERSATION_ERROR = '[Conversations] get conversation error';

export const POST_CONVERSATION_REQUEST = '[Conversations] post conversation request';
export const POST_CONVERSATION_SUCCESS = '[Conversations] post conversation success';
export const POST_CONVERSATION_ERROR = '[Conversations] post conversation error';



// export const connectToMessageHubRequest = createAction(GET_MESSAGES_REQUEST);
export const getMessagesSuccess = createAction(GET_MESSAGES_SUCCESS, props<{messages : Message[], statusCode: number}>());
export const getMessagesError = createAction(GET_MESSAGES_ERROR, props<{errorText: string, statusCode: number}>());

export const postMessageRequest = createAction(POST_MESSAGE_REQUEST, props<{request: MessageRequest}>());
export const postMessageSuccess = createAction(POST_MESSAGE_SUCCESS, props<{message: Message, statusCode: number}>());
export const postMessageError = createAction(POST_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>());

export const getConversationsSuccess = createAction(GET_CONVERSATION_SUCCESS, props<{conversations : Conversation[]}>())



