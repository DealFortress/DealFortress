import { Notice, NoticeRequest } from "../types";

const baseUrl = import.meta.env.VITE_API_SERVER_URL;

const noticesUrl = `${baseUrl}/notices`;
const productsUrl = `${baseUrl}/products`;
const categoriesUrl = `${baseUrl}/categories`;


export const GetNoticesAPI = async () => {
    try {
        const response = await fetch(noticesUrl);
        console.log(response)
        return response;
    } catch (error) {
        
        console.log(error);
        const myBlob = new Blob();
        const myOptions = {
            "type":"https://tools.ietf.org/html/rfc7231#section-6.5.4",
            "title":"Not Found",
            "status":404,
            "traceId":"00-ea327592d3895108d594ac4e3092e6fb-5820732527f81a92-00"
        }
        return new Response(myBlob, myOptions)
    }
    
};


export const PostNoticeAPI = async (noticeRequest: NoticeRequest) => {
    const requestBody = JSON.stringify(noticeRequest);
    console.log(requestBody);
    const response = await fetch(noticesUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: requestBody
    })
    console.log(response);
    return await response.json() as Notice;
}

export const GetProductsAPI = async () => {
    try {
        const response = await fetch(productsUrl);
        return response;
    } catch (error) {
        
        console.log(error);
        const myBlob = new Blob();
        const myOptions = {
            "type":"https://tools.ietf.org/html/rfc7231#section-6.5.4",
            "title":"Not Found",
            "status":404,
            "traceId":"00-ea327592d3895108d594ac4e3092e6fb-5820732527f81a92-00"
        }
        return new Response(myBlob, myOptions)
    }
    
};

export const GetCategoriesAPI = async () => {
    try {
        const response = await fetch(categoriesUrl);
        return response;
    } catch (error) {
        
        console.log(error);
        const myBlob = new Blob();
        const myOptions = {
            "type":"https://tools.ietf.org/html/rfc7231#section-6.5.4",
            "title":"Not Found",
            "status":404,
            "traceId":"00-ea327592d3895108d594ac4e3092e6fb-5820732527f81a92-00"
        }
        return new Response(myBlob, myOptions)
    }
    
};
