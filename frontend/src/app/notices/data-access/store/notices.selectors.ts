import { createFeatureSelector, createSelector} from '@ngrx/store';
import { NoticesState, noticesAdapter } from './notices.state';

const getNoticesState = createFeatureSelector<NoticesState>('noticesState');
 
const { selectAll } = noticesAdapter.getSelectors();

export const getNotices = createSelector(
    getNoticesState,
    selectAll
);

export const getUserLatestNoticeId = createSelector(
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