import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { POST_MESSAGE_REQUEST, getConversationsSuccess, getMessageError, getMessageSuccess, postMessageError, postMessageRequest, postMessageSuccess } from "./conversations.actions";
import { ShowAlert } from "@app/shared/store/app.actions";
import { of, Observable, merge } from "rxjs";
import { Injectable } from "@angular/core";
import { Message } from "@app/shared/models/message/message";
import { startSignalRHub, signalrHubUnstarted, signalrConnected, mergeMapHubToAction, findHub, hubNotFound } from "ngrx-signalr-core";
import { conversationHub } from "@app/conversations/utils/conversation.hub";
import { Conversation } from "@app/shared/models/conversation/conversation.model";

@Injectable()
export class ConversationsEffects {

    constructor(
        private actions$: Actions,
        ) {}


    initRealtime$ = createEffect(() =>
        this.actions$.pipe(
          ofType(signalrHubUnstarted),
          map((hub) => startSignalRHub(hub))
        )
    );

    listenToConversations$ = createEffect(() =>
    this.actions$.pipe(
        ofType(signalrConnected),
        mergeMapHubToAction(({ hub }) => {
        // TODO : add event listeners
        const getConversations$ = hub
            .on("getconversations")
            .pipe(
                map((conversations ) => {
                    return getConversationsSuccess({conversations: conversations as Conversation[]})
                }
                ),
                catchError((_error) => 
                    of(
                        ShowAlert({ message: 'Getting conversations failed', actionresult: 'fail' }),
                        getMessageError({errorText: _error.message, statusCode: _error.status})
                    )
                ))
        return merge(getConversations$);
        })
    )
    );

    listenToMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrConnected),
            mergeMapHubToAction(({ hub }) => {
            // TODO : add event listeners
            const getMessage$ = hub
                .on("getmessage")
                .pipe(
                    map((message ) => {
                        return getMessageSuccess({message: message as Message})
                    }
                    ),
                    catchError((_error) => 
                        of(
                            ShowAlert({ message: 'Getting messages failed', actionresult: 'fail' }),
                            getMessageError({errorText: _error.message, statusCode: _error.status})
                        )
                    ))
            return merge(getMessage$);
            })
        )
    );

    postMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(postMessageRequest), 
            mergeMap(({ request }) => {

            const hub = findHub(conversationHub);
            if (!hub) {
                return of(hubNotFound(conversationHub));
            }
            return hub.send("postmessage", request).pipe(
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

    // sendEvent$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(POST_MESSAGE_REQUEST), // TODO : create a custom action
    //         mergeMap(({ params }) => {
    //         const hub = findHub(conversationHub);
    //         if (!hub) {
    //             return of(hubNotFound(conversationHub));
    //         }

    //         // TODO : send event to the hub
    //         return hub.send("postmessage", params).pipe(
    //             map((_) => console.log("post success")),
    //             catchError((_error) => console.log("post failed"))
    //         );
    //         })
    //     )
    // );
}