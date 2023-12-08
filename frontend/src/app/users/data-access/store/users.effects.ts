import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { EmptyAction, ShowAlert } from '@app/shared/store/app.actions';
import { UsersApiService } from '../services/users-api.service';
import { loadUserByAuthIdError, loadUserByAuthIdRequest, loadUserByAuthIdSuccess, loadUserByIdError, loadUserByIdRequest, loadUserByIdSuccess, postUserError, postUserRequest, postUserSuccess } from './users.actions';
import { User } from '@app/shared/models/user.model';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class UsersEffect {

    constructor(
        private usersApiService: UsersApiService,
        private authService: AuthService,
        private actions$: Actions,
        ) {}


    loadUserByAuthId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadUserByAuthIdRequest),
            mergeMap((action) => {
                return this.usersApiService.getUserByAuthIdAPI(action.authId).pipe(
                    mergemap((user) => {
                        ShowAlert({ message: `Welcome back squire ${user.username}!`, actionresult: 'pass' })
                        return loadUserByAuthIdSuccess({user: user, statusCode: 200})
                    }
                    ),
                    catchError((_error) => of(
                            loadUserByAuthIdError({errorText: _error.message, statusCode: _error.status})
                        )
                    )
                );
            })
        );
    })

    loadUserById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadUserByIdRequest),
            mergeMap((action) => {
                return this.usersApiService.getUserByIdAPI(action.id).pipe(
                    map((user) => { 
                        return loadUserByIdSuccess({user: user, statusCode: 200})
                    }),
                    catchError((_error) => of(
                            loadUserByIdError({errorText: _error.message, statusCode: _error.status})
                        )
                    )
                );
            })
        );
    })



    postUser$ = createEffect(() =>
    this.actions$.pipe(
        ofType(postUserRequest),
        mergeMap(action =>
            this.usersApiService.postUserAPI(action).pipe(
                map(user => {
                            ShowAlert({ message: 'Welcome Squire!', actionresult: 'pass' });
                            return postUserSuccess({ user: user as User, statusCode: 201 });               
                        }
                    ),
                    catchError((_error) => of(
                            ShowAlert({ message: 'Failed to get user from server, please reconnect squire.', actionresult: 'fail' }),
                            postUserError({ errorText: _error.message, statusCode: _error.status})
                        )
                    ),
                )
            )
        )
    );

    logoutUser = createEffect(() => 
    this.actions$.pipe(
        ofType(postUserError),
        map(() => {
            setTimeout(() => {
                this.authService.logout({ logoutParams: { returnTo: document.location.origin } })
            }, 5000);
            return EmptyAction();
        })
    ))
}