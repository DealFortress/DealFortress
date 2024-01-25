import { UserRequest } from '@app/shared/models/user/user-request.model';
import { User } from '@app/shared/models/user/user.model';
import { createAction, props } from '@ngrx/store';

export const LOAD_USER_BY_ID_REQUEST = '[Users] load user by id request';
export const LOAD_USER_BY_ID_SUCCESS = '[Users] load user by id success';
export const LOAD_USER_BY_ID_ERROR = '[Users] load user by id error';

export const LOAD_USER_BY_AUTHID_REQUEST = '[Users] load user by authid request';
export const LOAD_USER_BY_AUTHID_SUCCESS = '[Users] load user by authid success';
export const LOAD_USER_BY_AUTHID_ERROR = '[Users] load user by authid error';

export const POST_USER_REQUEST = '[Users] post user';
export const POST_USER_SUCCESS = '[Users] post user success';
export const POST_USER_ERROR = '[Users] post user error';



export const loadUserByIdRequest = createAction(LOAD_USER_BY_ID_REQUEST, props<{id: number}>());
export const loadUserByIdSuccess = createAction(LOAD_USER_BY_ID_SUCCESS, props<{user: User, statusCode: number}>());
export const loadUserByIdError = createAction(LOAD_USER_BY_ID_ERROR, props<{errorText: string, statusCode: number}>());

export const loadUserByAuthIdRequest = createAction(LOAD_USER_BY_AUTHID_REQUEST, props<{authId: string}>());
export const loadUserByAuthIdSuccess = createAction(LOAD_USER_BY_AUTHID_SUCCESS, props<{user: User, statusCode: number}>());
export const loadUserByAuthIdError = createAction(LOAD_USER_BY_AUTHID_ERROR, props<{errorText: string, statusCode: number}>());

export const postUserRequest = createAction(POST_USER_REQUEST, props<UserRequest>());
export const postUserSuccess = createAction(POST_USER_SUCCESS, props<{user: User, statusCode: number}>());
export const postUserError = createAction(POST_USER_ERROR, props<{errorText: string, statusCode: number}>());


