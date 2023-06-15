import { Notice, NoticeRequest } from "../types";

const baseUrl = import.meta.env.VITE_API_SERVER_URL;

const noticesUrl = `${baseUrl}/notices`;
const productsUrl = `${baseUrl}/products`;
const categoriesUrl = `${baseUrl}/categories`;


export const GetNoticesAPI = async () => await fetch(noticesUrl);


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

export const GetProductsAPI = async () => await fetch(productsUrl);

export const GetCategoriesAPI = async () => await fetch(categoriesUrl);
