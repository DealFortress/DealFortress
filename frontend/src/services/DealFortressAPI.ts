import { Category, Product, Notice } from "../types";

// put in the env
const NoticeUrl = "https://localhost:5000/api/SellAds";
const ProductsUrl = "https://localhost:5000/api/products";
const CategoriesUrl = "https://localhost:5000/api/categories";


export const GetNoticesFromAPI = async () => {
    const response = await fetch(NoticeUrl);
    return await response.json() as Notice[];
}

export const GetProductsFromAPI = async () => {
    const response = await fetch(ProductsUrl);
    // console.log(await response.json());
    return await response.json() as Product[];
}

export const GetCategoriesFromAPI = async () => {
    const response = await fetch(CategoriesUrl);
    return await response.json() as Category[];
}
