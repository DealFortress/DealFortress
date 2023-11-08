import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EmptyAction, ShowAlert } from "./app.actions";
import { map, mergeMap } from "rxjs/operators";

@Injectable()
export class AppEffects {

    constructor(private action$: Actions, private snackbar: MatSnackBar) {}

    ShowAlert$ = createEffect(() =>
        this.action$.pipe(
            ofType(ShowAlert),
            mergeMap(action => {
                return this.ShowsnackbarAlert(action.message, action.actionresult)
                    .afterDismissed()
                    .pipe(
                        map(() => {
                            return EmptyAction();
                        })
                    )
            })
        )
    );

    ShowsnackbarAlert(message: string, actionresult: string = 'fail') {
        const cssClass = actionresult == 'pass' ? 'green-snackbar' : 'red-snackbar'
        return this.snackbar.open(message, 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: [cssClass],
            duration: 5000
        })
    }
}
