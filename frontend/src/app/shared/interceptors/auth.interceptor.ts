import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { switchMap, tap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor, OnInit {
    isAuthenticated? : boolean = false;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.isAuthenticated$.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated)
    }

    
  

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        if (this.isAuthenticated == true) {
            return this.authService.getAccessTokenSilently().pipe( 
                switchMap(token => { 
                    console.log(token);
                    const tokenizedRequest = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                    });
                    return next.handle(tokenizedRequest);
                })
            )
        } else {
            return next.handle(request);
        }
    }
}