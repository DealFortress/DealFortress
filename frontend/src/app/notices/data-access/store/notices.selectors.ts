import { createFeatureSelector, createSelector} from '@ngrx/store';
import { NoticesState, noticesAdapter } from './notices.state';

const getNoticesState = createFeatureSelector<NoticesState>('noticesState');
 
const { selectAll } = noticesAdapter.getSelectors();

export const getNotices = createSelector(
    getNoticesState,
    selectAll
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
export const getNoticeByUserId = (userId: number) => createSelector(
    getNotices,
    notices => notices.filter(notice => notice.userId == userId)
)