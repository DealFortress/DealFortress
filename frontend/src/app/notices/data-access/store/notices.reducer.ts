import { createReducer, on } from "@ngrx/store";
import { deleteNoticeError, deleteNoticeSuccess, loadNoticeByIdError, loadNoticeByIdRequest, loadNoticeByIdSuccess, loadNoticesError,
    loadNoticesRequest, loadNoticesSuccess, patchProductSoldStatusError, patchProductSoldStatusSuccess,
    postNoticeError, postNoticeSuccess, putNoticeError, putNoticeSuccess, setNoticesError, setNoticesRequest,
    setNoticesSuccess, setPagination } from "./notices.actions";
import { Status } from "@app/shared/models/state.model";
import { initialState, noticesAdapter } from "./notices.state";
import { Notice } from "@app/shared/models/notice/notice.model";
import { Product } from "@app/shared/models/product/product.model";
import { state } from "@angular/animations";


export const noticesReducer = createReducer(
    initialState,
    on(setNoticesRequest, (state) => {
        return {
            ...state,
            status: Status.loading
        };
    }),
    on(setNoticesSuccess,(state,action)=>{
        return noticesAdapter.setAll(action.notices, {
            ...state,
            status: Status.success,
            metaData: action.metaData
          });
    }),
    on(setNoticesError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
    on(loadNoticesRequest, (state) => {
        return {
            ...state,
            status: Status.loading
        };
    }),
    on(loadNoticesSuccess,(state,action)=>{
        return noticesAdapter.addMany(action.notices, {
            ...state,
            status: Status.success,
            metaData: action.metaData
          });
    }),
    on(loadNoticesError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
    on(loadNoticeByIdRequest, (state) => {
        return {
            ...state,
            status: Status.loading
        };
    }),
    on(loadNoticeByIdSuccess,(state,action)=>{
        return noticesAdapter.addOne(action.notice, {
            ...state,
            status: Status.success,
          });
    }),
    on(loadNoticeByIdError,(state,action)=>{
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
    on(postNoticeError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
    on(putNoticeSuccess,(state,action)=>{
        return noticesAdapter.upsertOne(action.notice, state);
    }),
    on(putNoticeError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
    on(deleteNoticeSuccess, (state, action)=> {
        return noticesAdapter.removeOne(action.noticeId, state)
    }),
    on(deleteNoticeError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
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
    on(patchProductSoldStatusError,(state,action)=>{
        return {
            ...state,
            errorMessage:action.errorText,
            status: Status.error
        }
    }),
    on(setPagination, (state, action) => {
        return {
            ...state,
            pagination: action
        }
    })
);
