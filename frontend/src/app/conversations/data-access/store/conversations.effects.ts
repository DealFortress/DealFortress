import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { getConversationError, getConversationSuccess, getConversationsSuccess,
    getMessageError, getMessageSuccess, patchLastReadMessageError,
    patchLastReadMessageRequest, patchLastReadMessageSuccess,
    postConversationError, postConversationRequest, postConversationSuccess,
    postMessageError, postMessageRequest, postMessageSuccess} from "./conversations.actions";
import { ShowAlert } from "@app/shared/store/app.actions";
import { of, merge } from "rxjs";
import { Injectable } from "@angular/core";
import { startSignalRHub, signalrHubUnstarted, signalrConnected, mergeMapHubToAction, findHub, hubNotFound } from "ngrx-signalr-core";
import { conversationHub } from "@app/conversations/utils/conversation.hub";
import { Conversation } from "@app/shared/models/conversation/conversation.model";
import { Message } from "@app/shared/models/message/message.model";
import { Store } from "@ngrx/store";
import { UsersService} from "@app/users/utils/services/users.service"

@Injectable()
export class ConversationsEffects {

    constructor(
        private actions$: Actions,
        private store : Store,
        private usersService : UsersService
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

        const getConversations$ = hub
            .on("getconversations")
            .pipe(
                map((conversations : unknown ) => {
                    (conversations as Conversation[]).forEach(conversation => {
                        this.usersService.loadUserById(conversation.buyerId);
                        this.usersService.loadUserById(conversation.sellerId);
                    })
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

    listenToConversation$ = createEffect(() =>
    this.actions$.pipe(
        ofType(signalrConnected),
        mergeMapHubToAction(({ hub }) => {
        // TODO : add event listeners
        
        const getConversation$ = hub
            .on("getconversation")
            .pipe(
                map((conversation ) => {
                    of(ShowAlert({ message: 'new conversation', actionresult: 'pass' }))
                    return getConversationSuccess({conversation: conversation as Conversation})
                }
                ),
                catchError((_error) => 
                    of(
                        ShowAlert({ message: 'error while fetching conversation', actionresult: 'fail' }),
                        getConversationError({errorText: _error.message, statusCode: _error.status})
                    )
                ))
        return merge(getConversation$);
        })
    ));


    postConversation$ = createEffect(() =>
    this.actions$.pipe(
        ofType(postConversationRequest), 
        mergeMap(({ request }) => {

        const hub = findHub(conversationHub);
        if (!hub) {
            return of(hubNotFound(conversationHub));
        }
        return hub.send("postconversation", request).pipe(
            map((conversation) => {
                of(ShowAlert({ message: 'New conversation created', actionresult: 'pass' }));
                return postConversationSuccess({conversation: conversation  as Conversation, statusCode: 200})
            }),
            catchError((_error) => 
                of(
                    ShowAlert({ message: 'Conversation creation failed', actionresult: 'fail' }),
                    postConversationError({errorText: _error.message, statusCode: _error.status})
                ))
            );
        })
    ));

    patchConversationLastMessageRead$ = createEffect(() =>
    this.actions$.pipe(
        ofType(patchLastReadMessageRequest), 
        mergeMap(({ request }) => {

        const hub = findHub(conversationHub);
        if (!hub) {
            return of(hubNotFound(conversationHub));
        }
        return hub.send("patchconversationlastreadmessage", request).pipe(
            map((conversation) => {
                console.log(conversation)
                return patchLastReadMessageSuccess({conversation: conversation  as Conversation, statusCode: 200})
            }),
            catchError((_error) => 
                of(
                    patchLastReadMessageError({errorText: _error.message, statusCode: _error.status})
                ))
            );
        })
    ));



    listenToMessage$ = createEffect(() =>
    this.actions$.pipe(
        ofType(signalrConnected),
        mergeMapHubToAction(({ hub }) => {

        const getMessage$ = hub
            .on("getmessage")
            .pipe(
                map((message ) => {
                    ShowAlert({ message: 'new message received', actionresult: 'pass' })
                    return getMessageSuccess({message: message as Message})
                }
                ),
                catchError((_error) => 
                    of(
                        ShowAlert({ message: 'new message error', actionresult: 'fail' }),
                        getMessageError({errorText: _error.message, statusCode: _error.status})
                    )
                ))
        return merge(getMessage$);
        })
    ));

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
                ShowAlert({ message: 'Message sent!', actionresult: 'pass' })
                return postMessageSuccess({message: message  as Message, statusCode: 200})
            }),
            catchError((_error) => 
                of(
                    ShowAlert({ message: 'Sending message failed', actionresult: 'fail' }),
                    postMessageError({errorText: _error.message, statusCode: _error.status})
                ))
            );
        })
    ));
}