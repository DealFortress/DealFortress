import { createReducer, on } from "@ngrx/store";
import { deleteNoticeRequest, deleteNoticeSuccess, loadNoticesError, loadNoticesRequest, loadNoticesSuccess, postNoticeSuccess, putNoticeSuccess } from "./notices.actions";
import { Status } from "@app/shared/models/state.model";
import { initialState, noticesAdapter } from "./notices.state";


export const noticesReducer = createReducer(
    initialState,
    on(loadNoticesRequest, (state) => {
        return {
            ...state,
            status: Status.loading
        };
    }),
    on(loadNoticesSuccess,(state,action)=>{
        return noticesAdapter.setAll(action.notices, {
            ...state,
            status: Status.success,
          });
    }),
    on(loadNoticesError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
    on(postNoticeSuccess,(state,action)=>{
        return noticesAdapter.addOne(action.notice, {
            ...state,
            userLatestNoticeId: action.notice.id
        });
    }),
    on(putNoticeSuccess,(state,action)=>{
        return noticesAdapter.upsertOne(action.notice, state);
    }),
    on(deleteNoticeSuccess, (state, action)=> {
        return noticesAdapter.removeOne(action.noticeId, state)
    })
);
