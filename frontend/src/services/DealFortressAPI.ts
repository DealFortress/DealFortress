import { Notice, NoticeRequest } from "../types";

const NoticeUrl = "https://localhost:5000/api/Notices";
const ProductsUrl = "https://localhost:5000/api/products";
const CategoriesUrl = "https://localhost:5000/api/categories";


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
