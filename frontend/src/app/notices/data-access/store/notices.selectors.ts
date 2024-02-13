import { createFeatureSelector, createSelector} from '@ngrx/store';
import { NoticesState, noticesAdapter } from './notices.state';
import { Pagination } from '@app/shared/models/pagination.model';

const getNoticesState = createFeatureSelector<NoticesState>('noticesState');
 
const { selectAll } = noticesAdapter.getSelectors();

export const getNotices = createSelector(
    getNoticesState,
    selectAll
);

export const getPaginatedNotices = (pagination : Pagination) => createSelector(
    getNotices,
    (state) => state.slice(pagination.pageIndex * pagination.pageSize, pagination.pageSize)
);

export const getLoggedInUserLatestNoticeId = createSelector(
    getNoticesState,
    (state) => state.userLatestNoticeId
)

export const getNoticesStatus = createSelector(
    getNoticesState,
    (state) => state.status
)

export const getNoticeById = (id: number) =>  createSelector(
    getNoticesState,
    state => state.entities[id]
)

export const getUserIdByNoticeId = (noticeId: number) => createSelector(
    getNotices,
    notices => notices.find(notice => notice.id == noticeId)?.userId
)

export const getNoticePageSize = createSelector(
    getNoticesState,
    (state) => state.pageSize
)