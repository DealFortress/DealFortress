import { Product, SellAd } from "../types";

// put in the env
const sellAdUrl = "https://localhost:5000/api/sellads";
const ProductsUrl = "https://localhost:5000/api/products";


export const GetSellAdsFromAPI = async () => {
    const response = await fetch(sellAdUrl);
    return await response.json() as SellAd[];
}


export const GetProductsFromAPI = async () => {
    const response = await fetch(ProductsUrl);
    return await response.json() as Product[];
}