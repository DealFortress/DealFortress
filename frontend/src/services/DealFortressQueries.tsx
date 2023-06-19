import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI, postNoticeAPI } from "./DealFortressAPI";



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
    useMutation({

            mutationFn: postNoticeAPI,
            onSuccess: () => {
                queryClient.invalidateQueries(["notices"], {exact: true})
            }
        })
}
