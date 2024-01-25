import { createReducer, on } from "@ngrx/store";
import { deleteNoticeRequest, deleteNoticeSuccess, loadNoticesError, loadNoticesRequest, loadNoticesSuccess, patchProductSoldStatusSuccess, postNoticeSuccess, putNoticeSuccess } from "./notices.actions";
import { Status } from "@app/shared/models/state.model";
import { initialState, noticesAdapter } from "./notices.state";
import { getNoticeById } from "./notices.selectors";
import { Notice } from "@app/shared/models/notice.model";
import { Product } from "@app/shared/models/product.model";


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
    }),
    on(patchProductSoldStatusSuccess,(state,action)=>{
        let notice = {...state.entities[action.product.noticeId]} as Notice;
        if (notice) {
            notice.products = notice?.products.map(product => {
                let updatedProduct = {...product} as Product;
                if ( product.id == action.product.id) {
                    updatedProduct.soldStatus = action.product.soldStatus
                }
                return updatedProduct;
            })
        }
        return noticesAdapter.upsertOne(notice!, state);
    }),
);
