import { Notice, NoticeRequest } from "../types";

const baseUrl = import.meta.env.VITE_API_SERVER_URL;

const noticesUrl = `${baseUrl}/notices`;
const productsUrl = `${baseUrl}/products`;
const categoriesUrl = `${baseUrl}/categories`;


export const getNoticesAPI = async () => {
    try {
        const response = await fetch(noticesUrl);
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

export const getProductsAPI = async () => {
    try {
        const response = await fetch(productsUrl);
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

};

export const getCategoriesAPI = async () => {
    try {
        const response = await fetch(categoriesUrl);
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

};
