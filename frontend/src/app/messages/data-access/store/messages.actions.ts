import { Message } from '@app/shared/models/message';
import {MessageRequest } from '@app/shared/models/message-request';
import { createAction, props } from '@ngrx/store';

export const CONNECT_TO_MESSAGE_HUB_REQUEST = '[Messages] connect to message hub request';
export const CONNECT_TO_MESSAGE_HUB_SUCCESS = '[Messages] connect to message hub success';
export const CONNECT_TO_MESSAGE_HUB_ERROR = '[Messages] connect to message hub error';


export const POST_MESSAGE_REQUEST = '[Messages] post message';
export const POST_MESSAGE_SUCCESS = '[Messages] post message success';
export const POST_MESSAGE_ERROR = '[Messages] post message error';



export const connectToMessageHubRequest = createAction(CONNECT_TO_MESSAGE_HUB_REQUEST);
export const connectToMessageHubSuccess = createAction(CONNECT_TO_MESSAGE_HUB_SUCCESS, props<{messages : Message[], statusCode: number}>());
export const connectToMessageHubError = createAction(CONNECT_TO_MESSAGE_HUB_ERROR, props<{errorText: string, statusCode: number}>());

export const postMessageRequest = createAction(POST_MESSAGE_REQUEST, props<{request: MessageRequest}>());
export const postMessageSuccess = createAction(POST_MESSAGE_SUCCESS, props<{message: Message, statusCode: number}>());
export const postMessageError = createAction(POST_MESSAGE_ERROR, props<{errorText: string, statusCode: number}>());


