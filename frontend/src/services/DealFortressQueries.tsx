import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI, postNoticeAPI } from "./DealFortressAPI";
import { useNavigate } from "react-router-dom";
import { Notice } from "../types";



export const NoticesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getNoticesAPI
});

export const CategoriesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getCategoriesAPI
});


export const PostNoticeMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({

            mutationFn: postNoticeAPI,
            onSuccess: (data : Notice) => {
                queryClient.invalidateQueries(["notices"], {exact: true})
                navigate(`notices/${data?.id}`)
            }

        })
    return
}
