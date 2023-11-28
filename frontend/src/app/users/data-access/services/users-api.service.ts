import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserRequest } from "@app/shared/models/user-request.model";
import { User } from "@app/shared/models/user.model";
import { environment } from "environments/environment.production";
import { Observable } from "rxjs";

@Injectable()
export class UsersApiService {

    private baseUrl = environment.apiServerUrl;
    private usersUrl = `${this.baseUrl}/users`;

    constructor(private httpClient: HttpClient) {}

    getUserByIdAPI(id: number): Observable<User> {
        return this.httpClient
            .get(`${this.usersUrl}/${id}?idType=id`)
            .pipe((data) => data as Observable<User>);
    }

    getUserByAuthIdAPI(authId : string): Observable<User> {
        return this.httpClient
            .get(`${this.usersUrl}/${authId}?idType=authid`)
            .pipe((data) => data as Observable<User>);
    }

    postUserAPI(request : UserRequest): Observable<User>  {
        return this.httpClient
            .post(this.usersUrl, request)
            .pipe((data) => data as Observable<User>);
    }
}