import { NoticeRequest } from '@app/shared/models/notice-request.model';
import { Notice } from '@app/shared/models/notice.model';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

export const LOAD_NOTICES_SUCCESS = '[Notices] load notices success';
export const LOAD_NOTICES_ERROR = '[Notices] load notices error';
export const LOAD_NOTICES_REQUEST = '[Notices] load notices request';
export const POST_NOTICE_REQUEST = '[Notices] post notice';
export const POST_NOTICE_SUCCESS = '[Notices] post notice success';
export const PUT_NOTICE_REQUEST = '[Notices] put notice';
export const PUT_NOTICE_SUCCESS = '[Notices] put notice success';


export const loadNoticesRequest = createAction(LOAD_NOTICES_REQUEST);
export const loadNoticesSuccess = createAction(LOAD_NOTICES_SUCCESS, props<{notices: Notice[]}>());
export const loadNoticesError = createAction(LOAD_NOTICES_ERROR, props<{errorText: string}>());

export const postNoticeRequest = createAction(POST_NOTICE_REQUEST, props<{request: NoticeRequest}>());
export const postNoticeSuccess = createAction(POST_NOTICE_SUCCESS, props<{notice: Notice}>());

export const putNoticeRequest = createAction(PUT_NOTICE_REQUEST, props<{request: NoticeRequest, noticeId: number}>());
export const putNoticeSuccess = createAction(PUT_NOTICE_SUCCESS, props<{notice: Update<Notice>}>());


