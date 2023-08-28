import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI, postNoticeAPI } from "./DealFortressAPI";

export const GetNoticesQuery = (accessToken: Promise<string>) =>  useQuery({
    queryKey: ["notices", accessToken],
    queryFn: () => getNoticesAPI(accessToken),
});

export const GetCategoriesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getCategoriesAPI
});

export const PostNoticeMutation = () => useMutation({
    mutationFn: postNoticeAPI,
});


