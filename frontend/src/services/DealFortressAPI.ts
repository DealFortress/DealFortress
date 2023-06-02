import { Category, Product, SellAd } from "../types";

// put in the env
const sellAdUrl = "https://localhost:5000/api/sellads";
const ProductsUrl = "https://localhost:5000/api/products";
const CategoriesUrl = "https://localhost:5000/api/categories";


export const GetSellAdsFromAPI = async () => {
    const response = await fetch(sellAdUrl);
    return await response.json() as SellAd[];
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
