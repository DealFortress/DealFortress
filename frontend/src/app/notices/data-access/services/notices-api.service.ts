import { Notice } from "@app/shared/models/notice.model";
import { environment } from 'environments/environment.production';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoticeRequest } from "@app/shared/models/notice-request.model";
import { Injectable } from "@angular/core";


@Injectable()
export class NoticesApiService {
    private baseUrl = environment.apiServerUrl;
    private noticesUrl = `${this.baseUrl}/notices`;

    constructor(private httpClient: HttpClient) {
    }

    getAllNoticesAPI(): Observable<Notice[]>{
        return this.httpClient
            .get(this.noticesUrl)
            .pipe(data => data as Observable<Notice[]>);
    }

    postNoticeAPI(request: NoticeRequest): Observable<Notice> {
        return this.httpClient
            .post(
                this.noticesUrl, 
                request)
            .pipe(data => data as Observable<Notice>);
    }

    putNoticeAPI(request: NoticeRequest, noticeId: number): Observable<Notice> {
        return this.httpClient
            .put(
                `${this.noticesUrl}/${noticeId}`,
                request)
            .pipe(data => data as Observable<Notice>);
    }
}