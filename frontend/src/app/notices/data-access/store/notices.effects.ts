import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NoticesApiService } from '../services/notices-api.service';
import { Notice } from '@app/shared/models/notice.model';
import { catchError, map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { loadNoticesError, loadNoticesRequest, loadNoticesSuccess, postNoticeRequest, postNoticeSuccess, putNoticeRequest } from './notices.actions';
import { of } from 'rxjs';
import { ShowAlert } from '@app/shared/store/app.actions';

@Injectable()
export class NoticesEffects {

    constructor(
        private noticesApiService: NoticesApiService,
        private actions$: Actions,
        ) {}


    loadNotices$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadNoticesRequest),
            mergeMap(() => {
                return this.noticesApiService.getAllNoticesAPI().pipe(
                    map((notices) => {
                        return (loadNoticesSuccess({notices: notices}));
                    }),
                    catchError((_error) => {
                        return of(loadNoticesError({errorText: _error.message}));
                    })
                );
            })
        );
    })

    postNotices$ = createEffect(() =>
    this.actions$.pipe(
        ofType(postNoticeRequest),
        mergeMap(action =>
            this.noticesApiService.postNoticeAPI(action.request).pipe(
                mergeMap(notice => 
                        of(
                        postNoticeSuccess({ notice: notice as Notice }),
                        ShowAlert({ message: 'Created successfully.', actionresult: 'pass' })                  
                        )
                    ),
                catchError((_error) => of(ShowAlert({ message: 'Failed to create notice.', actionresult: 'fail' }))),
                )
            )
        )
    );

    putNotices$ = createEffect(() =>
    this.actions$.pipe(
        ofType(putNoticeRequest),
        mergeMap(action =>
            this.noticesApiService.putNoticeAPI(action.request, action.noticeId).pipe(
                mergeMap(notice => 
                        of(
                        postNoticeSuccess({ notice: notice as Notice }),
                        ShowAlert({ message: 'Created successfully.', actionresult: 'pass' })                    
                        )
                    ),
                catchError((_error) => of(ShowAlert({ message: 'Failed to create notice.', actionresult: 'fail' }))),
                )
            )
        )
    );
}