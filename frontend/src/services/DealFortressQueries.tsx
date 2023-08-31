import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI, postNoticeAPI } from "./DealFortressAPI";
import { NoticeRequest } from "../types";

export const GetNoticesQuery = (accessToken: string) =>  useQuery({
    queryKey: ["notices", accessToken],
    queryFn: () => getNoticesAPI(accessToken),
});

export const GetCategoriesQuery = (accessToken: string) =>  useQuery({
    queryKey: ["notices", accessToken],
    queryFn: () => getCategoriesAPI(accessToken)
});

export const PostNoticeMutation = (noticeRequest : NoticeRequest, accessToken: string) => useMutation({
    mutationFn: () => postNoticeAPI(noticeRequest, accessToken),
});


