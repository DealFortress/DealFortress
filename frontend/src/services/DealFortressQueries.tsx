import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteNoticeAPI, getCategoriesAPI, getNoticeAPI, getNoticesAPI, postNoticeAPI, putNoticeAPI } from "./DealFortressAPI";

export const GetNoticesQuery = () =>  useQuery({
  queryKey: ["notices"],
  queryFn:  getNoticesAPI
});

export const GetNoticeQuery = (id: number) => useQuery({
  queryKey: [`notice ${id}`, id],
  queryFn: () => getNoticeAPI(id)
})

export const PostNoticeMutation = () => useMutation({
  mutationFn: postNoticeAPI
});

export const PutNoticeMutation = () => useMutation({
  mutationFn: putNoticeAPI
})

export const DeleteNoticeMutation = () => useMutation({
  mutationFn: deleteNoticeAPI
})



export const GetCategoriesQuery = () =>  useQuery({
  queryKey: ["notices"],
  queryFn: getCategoriesAPI
});



