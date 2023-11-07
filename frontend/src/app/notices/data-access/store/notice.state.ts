import { Status } from "@app/shared/models/state.model"
import { Notice } from "../../../shared/models/notice.model"
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity"
import { NoticesService } from "@app/notices/utils/services/notices.services"

export interface NoticesState extends EntityState<Notice> {
    userLatestNoticeId?: number,
    errorMessage: string,
    status: Status
}

export const sortByDate = (a: Notice, b: Notice) => {
    return NoticesService.convertDateToMinutes(b.createdAt) - NoticesService.convertDateToMinutes(a.createdAt) 
}

export const noticesAdapter: EntityAdapter<Notice> = createEntityAdapter<Notice>({
    sortComparer: sortByDate
})

export const initialState : NoticesState = noticesAdapter.getInitialState({ errorMessage: '', status: Status.loading });