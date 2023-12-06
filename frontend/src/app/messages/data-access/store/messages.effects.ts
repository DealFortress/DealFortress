import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, mergeMap } from "rxjs/operators";
import { connectToMessageHubError, connectToMessageHubRequest, connectToMessageHubSuccess, postMessageError, postMessageSuccess } from "./messages.actions";
import { ShowAlert } from "@app/shared/store/app.actions";
import { of, pipe } from "rxjs";
import { Injectable } from "@angular/core";
import { MessagesService } from "../service/messages.service";

@Injectable()
export class MessagesEffect {

    constructor(
        private actions$: Actions,
        private messageService: MessagesService
        ) {}


    connectToMessageHub$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(connectToMessageHubRequest),
            mergeMap((action) => {
                return this.messageService.startConnection().pipe(
                    mergeMap((messages) => of(   
                            connectToMessageHubSuccess({messages: messages, statusCode: 200})
                        )
                    ),
                    catchError((_error) => of(
                            ShowAlert({ message: '', actionresult: 'fail' }),
                            connectToMessageHubError({errorText: _error.message, statusCode: _error.status})
                        )
                    )
                )   
            })
        );
    })



    // postMessage$ = createEffect(() =>
    // this.actions$.pipe(
    //     ofType(postMessageRequest),
    //     mergeMap(action =>
    //         this..pipe(
    //             mergeMap(user => of(
    //                         ShowAlert({ message: '', actionresult: 'pass' }),
    //                         postMessageSuccess()                   
    //                     )
    //                 ),
    //                 catchError((_error) => of(
    //                         ShowAlert({ message: '', actionresult: 'fail' }),
    //                         postMessageError()
    //                     )
    //                 ),
    //             )
    //         )
    //     )
    // );
}