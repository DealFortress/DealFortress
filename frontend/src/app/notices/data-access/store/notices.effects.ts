import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NoticesApiService } from '../services/notices-api/notices-api.service';
import { ProductsApiService } from '../services/products-api/products-api.service';

import { Notice } from '@app/shared/models/notice/notice.model';
import { catchError, map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {    
    deleteNoticeError,
            deleteNoticeRequest, deleteNoticeSuccess, 
            loadNoticeByIdError, 
            loadNoticeByIdRequest, 
            loadNoticeByIdSuccess, 
            loadNoticesError, loadNoticesRequest, 
            loadNoticesSuccess, 
            patchProductSoldStatusRequest, patchProductSoldStatusSuccess, 
            postNoticeError, 
            postNoticeRequest, postNoticeSuccess, 
            putNoticeError, 
            putNoticeRequest, putNoticeSuccess, setNoticesError, setNoticesRequest, setNoticesSuccess 
        } from './notices.actions';
import { of } from 'rxjs';
import { ShowAlert } from '@app/shared/store/app.actions';
import { Product } from '@app/shared/models/product/product.model';
import { UsersService } from '@app/users/utils/services/users.service';

@Injectable()
export class NoticesEffects {

    constructor(
        private noticesApiService: NoticesApiService,
        private productsApiService: ProductsApiService,
        private usersService: UsersService,
        private actions$: Actions,
        ) {}


    setNotices$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(setNoticesRequest),
            mergeMap((action) => {
                return this.noticesApiService.getAllNoticesAPI({pageIndex: action.pageIndex, pageSize: action.pageSize}).pipe(
                    map((pagedList) => {
                        const notices = pagedList.entities;
                        notices.forEach(notice => {
                            this.usersService.loadUserById(notice.userId);
                        })
                        return (setNoticesSuccess({notices: notices, metaData: pagedList.metaData}));
                    }),
                    catchError((_error) => {
                        return of(setNoticesError({errorText: _error.message}));
                    })
                );
            })
        );
    })

    loadNotices$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadNoticesRequest),
            mergeMap((action) => {
                return this.noticesApiService.getAllNoticesAPI({pageIndex: action.pageIndex, pageSize: action.pageSize}).pipe(
                    map((pagedList) => {
                        const notices = pagedList.entities;
                        notices.forEach(notice => {
                            this.usersService.loadUserById(notice.userId);
                        })
                        return (loadNoticesSuccess({notices: notices, metaData: pagedList.metaData}));
                    }),
                    catchError((_error) => {
                        return of(loadNoticesError({errorText: _error.message}));
                    })
                );
            })
        );
    })


    loadNotice$ = createEffect(() => 
        this.actions$.pipe(
        ofType(loadNoticeByIdRequest),
        mergeMap((action) => 
            this.noticesApiService.getNoticeByIdAPI(action.id).pipe(
                map((notice) => {         
                    this.usersService.loadUserById(notice.userId);
                    return (loadNoticeByIdSuccess({notice: notice}));
                }),
                catchError((_error) => {
                    of(ShowAlert({ message: `Failed to load notice.`, actionresult: 'fail' }));
                    return of(loadNoticeByIdError({errorText: _error.message}));
                })
            )
        )
    ))

    postNotice$ = createEffect(() =>
    this.actions$.pipe(
        ofType(postNoticeRequest),
        mergeMap(action =>
            this.noticesApiService.postNoticeAPI(action.request).pipe(
                map(notice => {
                    of(ShowAlert({ message: 'Created successfully.', actionresult: 'pass' }));
                    return postNoticeSuccess({ notice: notice as Notice });
                }),
                catchError((_error) => {
                    of(ShowAlert({ message: `Failed to post notice.`, actionresult: 'fail' }));
                    return of(postNoticeError({errorText: _error.message}));
                })
            )
        )
    ));

    putNotice$ = createEffect(() =>
    this.actions$.pipe(
        ofType(putNoticeRequest),
        mergeMap(action =>
            this.noticesApiService.putNoticeAPI(action.request, action.noticeId).pipe(
                map(notice => {
                    ShowAlert({ message: 'Updated successfully.', actionresult: 'pass' });                 
                    return putNoticeSuccess({ notice: notice as Notice });
                }),
                catchError((_error) => {
                    of(ShowAlert({ message: `Failed to update notice.`, actionresult: 'fail' }));
                    return of(putNoticeError({errorText: _error.message}));
                })
            )
        )
    ));

    deleteNotice$ = createEffect(() =>
    this.actions$.pipe(
        ofType(deleteNoticeRequest),
        mergeMap(action =>
            this.noticesApiService.deleteNoticeAPI(action.noticeId).pipe(
                map(() => {
                    ShowAlert({ message: 'Deleted successfully.', actionresult: 'pass' });                   
                    return deleteNoticeSuccess({noticeId: action.noticeId});
                }),
                catchError((_error) => {
                    of(ShowAlert({ message: `Failed to delete notice.`, actionresult: 'fail' }));
                    return of(deleteNoticeError({errorText: _error.message}));
                })
            )
        )
    ))

    // Products
    patchProductSoldStatus$ = createEffect(() =>
    this.actions$.pipe(
        ofType(patchProductSoldStatusRequest),
        mergeMap(action =>
            this.productsApiService.patchProductSoldStatusAPI(action.productId, action.soldStatus).pipe(
                map(product => {
                    ShowAlert({ message: 'Updated sold status successfully.', actionresult: 'pass' });
                    return patchProductSoldStatusSuccess({ product: product as Product });
                }),
                catchError((_error) => {
                    of(ShowAlert({ message: `Failed to update sold status.`, actionresult: 'fail' }));
                    return of(deleteNoticeError({errorText: _error.message}));
                })
            )
        )
    ))
}