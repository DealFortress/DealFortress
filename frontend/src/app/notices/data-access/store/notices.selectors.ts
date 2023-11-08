import { createFeatureSelector, createSelector} from '@ngrx/store';
import { NoticesState, noticesAdapter } from './notice.state';

const getNoticeState = createFeatureSelector<NoticesState>('noticesState');
 
const { selectAll } = noticesAdapter.getSelectors();

export const getNotices = createSelector(
    getNoticeState,
    selectAll
);

export const getUserLatestNoticeId = createSelector(
    getNoticeState,
    (state) => state.userLatestNoticeId
)

export const getNoticesStatus = createSelector(
    getNoticeState,
    (state) => state.status
)

export const getNoticeById = (id: number) =>  createSelector(
    getNoticeState,
    state => state.entities[id]
)