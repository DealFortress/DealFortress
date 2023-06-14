import { Category, Product, Notice, NoticeRequest } from "../types";

// put in the env
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

export const GetProductsAPI = async () => {
    const response = await fetch(ProductsUrl);
    // console.log(await response.json());
    return await response.json() as Product[];
}

export const GetCategoriesAPI = async () => {
    const response = await fetch(CategoriesUrl);
    return await response.json() as Category[];
}
