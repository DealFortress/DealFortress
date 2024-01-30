import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { switchMap, tap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService) { 
    }


    
  

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        return this.authService.isAuthenticated$.pipe(
            switchMap(isAuthenticated => {
                if (isAuthenticated) {
                    return this.tokenizeRequest(request, next);
                } else {
                    return next.handle(request);
                }
            })
        )     
    }
    
    tokenizeRequest(request: HttpRequest<unknown>, next: HttpHandler) {
        return this.authService.getAccessTokenSilently().pipe( 
            switchMap(token => { 
                const tokenizedRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
                });
                return next.handle(tokenizedRequest);
            })
        )
    }
    }

