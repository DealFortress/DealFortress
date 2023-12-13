import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { POST_MESSAGE_REQUEST, getMessagesError, getMessagesSuccess, postMessageError, postMessageSuccess } from "./messages.actions";
import { ShowAlert } from "@app/shared/store/app.actions";
import { of, Observable, merge } from "rxjs";
import { Injectable } from "@angular/core";
import { Message } from "@app/shared/models/message";
import { startSignalRHub, signalrHubUnstarted, signalrConnected, mergeMapHubToAction, findHub, hubNotFound } from "ngrx-signalr-core";
import { createAction, props } from "@ngrx/store";
import { messageHub } from "@app/messages/utils/message.hub";

@Injectable()
export class MessagesEffect {

    constructor(
        private actions$: Actions,
        ) {}


    initRealtime$ = createEffect(() =>
        this.actions$.pipe(
          ofType(signalrHubUnstarted),
          map((hub) => startSignalRHub(hub))
        )
    );

    listenToMessages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrConnected),
            mergeMapHubToAction(({ hub }) => {
            // TODO : add event listeners
            const getMessages$ = hub
                .on("getmessages")
                .pipe(
                    map((messages ) => {
                        return getMessagesSuccess({messages: messages as Message[], statusCode: 200})
                    }
                    ),
                    catchError((_error) => 
                        of(
                            ShowAlert({ message: 'Getting messages failed', actionresult: 'fail' }),
                            getMessagesError({errorText: _error.message, statusCode: _error.status})
                        )
                    ))
            return merge(getMessages$);
            })
        )
    );

    postMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(POST_MESSAGE_REQUEST), 
            mergeMap(({ params }) => {
            const hub = findHub(messageHub);
            if (!hub) {
                return of(hubNotFound(messageHub));
            }

            return hub.send("postmessage", params).pipe(
                map((message) => {
                    return postMessageSuccess({message: message  as Message, statusCode: 200})
                }),
                catchError((_error) => 
                    of(
                        ShowAlert({ message: 'Sending message failed', actionresult: 'fail' }),
                        postMessageError({errorText: _error.message, statusCode: _error.status})
                    ))
            );
            })
        )
    );
}