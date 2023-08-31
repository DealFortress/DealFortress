import { NoticeRequest } from "../types";
import  axios from 'axios';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;
const noticesUrl = `${baseUrl}/notices`;
const categoriesUrl = `${baseUrl}/categories`;

export const getNoticesAPI = async (accessToken: string) => {
    const response = await axios.get(noticesUrl, {headers: {Authorization: accessToken}});
    return response.data;
};

export const getCategoriesAPI = async (accessToken: string) => {
    const response = await axios.get(categoriesUrl, {headers: {Authorization: accessToken}});
    return response.data;
};

export const postNoticeAPI = async (noticeRequest : NoticeRequest, accessToken: string) => {
    const response = await axios.post(noticesUrl, noticeRequest, {headers: {Authorization: accessToken}})
    return response.data;
};
