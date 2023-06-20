import { NoticeRequest } from "../types";
import  axios from 'axios';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;
const noticesUrl = `${baseUrl}/notices`;
const categoriesUrl = `${baseUrl}/categories`;

export const getNoticesAPI = async () => {
    const response = await axios.get(noticesUrl);
    return response.data;
};

export const getCategoriesAPI = async () => {
    const response = await axios.get(categoriesUrl);
    return response.data;
};

export const postNoticeAPI = async (noticeRequest : NoticeRequest) => {
    const response = await axios.post(noticesUrl, noticeRequest)
    return response.data;
};
