import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { connectToMessageHubError, connectToMessageHubRequest, connectToMessageHubSuccess } from "./messages.actions";
import { ShowAlert } from "@app/shared/store/app.actions";
import { of, Observable, merge } from "rxjs";
import { Injectable } from "@angular/core";
import { MessagesApiService } from "../service/messages-api.service";
import { Message } from "@app/shared/models/message";
import { startSignalRHub, signalrHubUnstarted, signalrConnected, mergeMapHubToAction } from "ngrx-signalr-core";
import { createAction, props } from "@ngrx/store";

@Injectable()
export class MessagesEffect {

    constructor(
        private actions$: Actions,
        private messageApiService: MessagesApiService
        ) {}


    initRealtime$ = createEffect(() =>
        this.actions$.pipe(
          ofType(signalrHubUnstarted),
          map((hub) => startSignalRHub(hub))
        )
    );

    listenToEvents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrConnected),
            mergeMapHubToAction(({ hub }) => {
            // TODO : add event listeners
            const whenEvent1$ = hub
                .on("sendmessages")
                .pipe(map((x: any) => {
                    console.log(x);
                    return createAction(x)
                }));

            return merge(whenEvent1$);
        })
        )
    );

    // connectToMessageHub$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(connectToMessageHubRequest),npm
    //         mergeMap(() => 
    //             this.messageApiService.startConnection()
    //             .pipe(
    //                 map((messages : Message[]) => connectToMessageHubSuccess({messages: messages, statusCode: 200})
    //                 ),
    //                 catchError((_error) => 
    //                     of(
    //                         ShowAlert({ message: 'Connection to hub failed', actionresult: 'fail' }),
    //                         connectToMessageHubError({errorText: _error.message, statusCode: _error.status})
    //                     )
    //                 )
    //             )   
    //         )
    //     );
    // })



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