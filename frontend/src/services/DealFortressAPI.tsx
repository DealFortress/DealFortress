import { NoticeRequest, PostRequestType, PutRequestType } from "../types";
import  axios from 'axios';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;
const noticesUrl = `${baseUrl}/notices`;
const categoriesUrl = `${baseUrl}/categories`;

export const getNoticesAPI = async () => {
    const response = await axios.get(noticesUrl);
    return response.data;
};

export const getNoticeAPI = async ( id : number) => {
  const response = await axios.get(`${noticesUrl}/${id}`);
  return response.data;
}

export const postNoticeAPI = async ({request, accessToken}: PostRequestType<NoticeRequest>) => {
  const response = await axios.post(noticesUrl, request, {headers: {Authorization: `Bearer ${accessToken}`}})
  return response.data;
};

export const putNoticeAPI = async ({id, request, accessToken}: PutRequestType<NoticeRequest>) => {
  const response = await axios.put(`${noticesUrl}/${id}`, request, {headers: {Authorization: `Bearer ${accessToken}`}})
  return response.data;
}

export const deleteNoticeAPI = async (id : number) => {
  const response = await axios.delete(`${noticesUrl}/${id}`);
  return response.data;
}




export const getCategoriesAPI = async () => {
    const response = await axios.get(categoriesUrl);
    return response.data;
};


