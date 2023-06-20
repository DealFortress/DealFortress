import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI, postNoticeAPI } from "./DealFortressAPI";




export const GetNoticesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getNoticesAPI
});

export const GetCategoriesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getCategoriesAPI
});

export const PostNoticeMutation = () => useMutation({
    mutationFn: postNoticeAPI,
    })


