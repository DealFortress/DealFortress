import { Notice, NoticeRequest } from "../types";

const NoticeUrl = import.meta.env.VITE_NOTICE_URL
const ProductsUrl = import.meta.env.VITE_PRODUCTS_URL
const CategoriesUrl = import.meta.env.VITE_CATEGORIES_URL


export const GetNoticesAPI = async () => await fetch(NoticeUrl);


export const PostNoticeAPI = async (noticeRequest: NoticeRequest) => {
    const requestBody = JSON.stringify(noticeRequest);
    console.log(requestBody);
    const response = await fetch(NoticeUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: requestBody
    })
    console.log(response);
    return await response.json() as Notice;
}

export const GetProductsAPI = async () => await fetch(ProductsUrl);

export const GetCategoriesAPI = async () => await fetch(CategoriesUrl);
