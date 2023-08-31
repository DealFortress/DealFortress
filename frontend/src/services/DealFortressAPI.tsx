import { useAuth0 } from "@auth0/auth0-react";
import { NoticeRequest } from "../types";
import  axios from 'axios';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;
const noticesUrl = `${baseUrl}/notices`;
const categoriesUrl = `${baseUrl}/categories`;

const GetAccessToken = async () => {
    const { getAccessTokenSilently } = useAuth0();

    try {
        const token = await getAccessTokenSilently();
        return (`Bearer ${token}`);
    } catch (e) {
        console.log(e);
    }
    return;
}
export const getNoticesAPI = async () => {
    const response = await axios.get(noticesUrl);
    return response.data;
};

export const getCategoriesAPI = async () => {
    const response = await axios.get(categoriesUrl);
    return response.data;
};

export const postNoticeAPI = async (noticeRequest : NoticeRequest) => {
    const accessToken = await GetAccessToken();
    console.log(accessToken);
    const response = await axios.post(noticesUrl, noticeRequest, {headers: {Authorization: accessToken}})
    return response.data;
};
