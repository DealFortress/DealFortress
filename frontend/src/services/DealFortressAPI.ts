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



export const postNoticeAPI = async (noticeRequest: NoticeRequest) => {
    try {
        const requestBody = JSON.stringify(noticeRequest);
        const response = await fetch(noticesUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: requestBody
        })
        return response;
    } catch (error) {

        const myBlob = new Blob();
        const myOptions = {
            "type":"",
            "title":"Server error",
            "status":500,
            "traceId":""
        }
        return new Response(myBlob, myOptions)
    }

}


