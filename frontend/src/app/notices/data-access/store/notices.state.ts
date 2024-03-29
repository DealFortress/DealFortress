import { Status } from "@app/shared/models/state.model"
import { Notice } from "../../../shared/models/notice/notice.model"
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity"
import { convertDateToMinutes } from "@app/shared/helper-functions/helper-functions"
import { Metadata } from "@app/shared/models/pagedList.model"
import { Pagination } from "@app/shared/models/pagination.model"

export interface NoticesState extends EntityState<Notice> {
    metaData?: Metadata, 
    userLatestNoticeId?: number,
    errorMessage: string,
    status: Status,
    pagination: Pagination
}

export const sortByDate = (a: Notice, b: Notice) => {
    return convertDateToMinutes(b.createdAt) - convertDateToMinutes(a.createdAt) 
}

export const noticesAdapter: EntityAdapter<Notice> = createEntityAdapter<Notice>({
    sortComparer: sortByDate
})

export const initialState : NoticesState = noticesAdapter.getInitialState({ errorMessage: '', status: Status.loading, pagination: {pageIndex: 0, pageSize: 20}});