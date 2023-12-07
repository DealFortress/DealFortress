import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { connectToMessageHubError, connectToMessageHubRequest, connectToMessageHubSuccess } from "./messages.actions";
import { ShowAlert } from "@app/shared/store/app.actions";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { MessagesApiService } from "../service/messages-api.service";
import { Observable } from "rxjs-compat";
import { Message } from "@app/shared/models/message";

@Injectable()
export class MessagesEffect {

    constructor(
        private actions$: Actions,
        private messageApiService: MessagesApiService
        ) {}


    connectToMessageHub$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(connectToMessageHubRequest),
            mergeMap(() => 
                this.messageApiService.startConnection()
                .pipe(
                    map((messages : Message[]) => connectToMessageHubSuccess({messages: messages, statusCode: 200})
                    ),
                    catchError((_error) => 
                        of(
                            ShowAlert({ message: 'Connection to hub failed', actionresult: 'fail' }),
                            connectToMessageHubError({errorText: _error.message, statusCode: _error.status})
                        )
                    )
                )   
            )
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