import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesAPI, getNoticesAPI, postNoticeAPI } from "./DealFortressAPI";
import { useNavigate } from "react-router-dom";
import { Notice, NoticeRequest } from "../types";
import axios from "axios";



export const GetNoticesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getNoticesAPI
});

export const GetCategoriesQuery = () =>  useQuery({
    queryKey: ["notices"],
    queryFn: getCategoriesAPI
});


export const PostNoticeMutation = () =>  useMutation({
    mutationFn: postNoticeAPI,
    })


