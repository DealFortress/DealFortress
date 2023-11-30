import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    accessToken: string = '';
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        this.authService.getAccessTokenSilently().subscribe(accessToken => {
            this.accessToken = accessToken;
        });
        
        const tokenizedRequest = request.clone({
            headers: request.headers.append('Authorization', `Bearer ${this.accessToken}`) 
        });
        return next.handle(tokenizedRequest);
    }
}