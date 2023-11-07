import { NoticeRequest } from '@app/shared/models/notice-request.model';
import { Notice } from '@app/shared/models/notice.model';
import { createAction, props } from '@ngrx/store';

export const LOAD_NOTICES_SUCCESS = '[Notices] load notices success';
export const LOAD_NOTICES_ERROR = '[Notices] load notices error';
export const LOAD_NOTICES_REQUEST = '[Notices] load notices request';
export const POST_NOTICE_REQUEST = '[Notices] post notice';
export const POST_NOTICE_SUCCESS = '[Notices] post notice success';


export const loadNoticesRequest = createAction(LOAD_NOTICES_REQUEST);
export const loadNoticesSuccess = createAction(LOAD_NOTICES_SUCCESS, props<{notices: Notice[]}>());
export const loadNoticesError = createAction(LOAD_NOTICES_ERROR, props<{errorText: string}>());

export const postNoticeRequest = createAction(POST_NOTICE_REQUEST, props<NoticeRequest>());
export const postNoticeSuccess = createAction(POST_NOTICE_SUCCESS, props<{notice: Notice}>());


