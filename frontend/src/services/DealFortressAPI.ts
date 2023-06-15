import { Category, Product, Notice, NoticeRequest } from "../types";

const NoticeUrl = "https://localhost:5000/api/Notices";
const ProductsUrl = "https://localhost:5000/api/products";
const CategoriesUrl = "https://localhost:5000/api/categories";


export const GetNoticesAPI = async () => {
    const response = await fetch(NoticeUrl);
    return await response.json() as Notice[];
}

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
    return response;
}

export const GetProductsAPI = async () => {
    const response = await fetch(ProductsUrl);
    return await response.json() as Product[];
}

export const GetCategoriesAPI = async () => {
    const response = await fetch(CategoriesUrl);
    return await response.json() as Category[];
}
