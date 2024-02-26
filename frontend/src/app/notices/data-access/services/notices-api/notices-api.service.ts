import { Notice } from "@app/shared/models/notice/notice.model";
import { environment } from 'environments/environment.production';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoticeRequest } from "@app/shared/models/notice/notice-request.model";
import { Injectable } from "@angular/core";
import { PagedList } from "@app/shared/models/pagedList.model";
import { Pagination } from "@app/shared/models/pagination.model";


@Injectable()
export class NoticesApiService {
    private baseUrl = environment.apiServerUrl;
    private noticesUrl = `${this.baseUrl}/notices`;

    constructor(private httpClient: HttpClient) {
    }

    getAllNoticesAPI(pagination : Pagination): Observable<PagedList<Notice>>{
        return this.httpClient
            .get(`${this.noticesUrl}?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`)
            .pipe(data => data as Observable<PagedList<Notice>>);
    }

    getNoticeByIdAPI(id: number): Observable<Notice>{
        return this.httpClient
            .get(`${this.noticesUrl}/${id}`)
            .pipe(data => data as Observable<Notice>);
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

    deleteNoticeAPI(noticeId: number) {
        return this.httpClient
            .delete(`${this.noticesUrl}/${noticeId}`)
            .pipe(data => {
                return data;
            });
    }
}