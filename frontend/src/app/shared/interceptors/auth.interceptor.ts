import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    accessToken: string = '';
    constructor(authService: AuthService) {
        
        authService.getAccessTokenSilently().subscribe(accessToken => {
            this.accessToken = accessToken;
        })
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        const tokenizedRequest = request.clone({
            headers: request.headers.append('Authorization', `Bearer ${this.accessToken}`) 
        });
        return next.handle(tokenizedRequest);
    }
}