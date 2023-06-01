import { SellAd } from "../types";

// put in the env
const sellAdUrl = "https://localhost:5000/api/SellAds";

export const GetSellAdsFromAPI = async () => {
    const response = await fetch(sellAdUrl);
    return await response.json() as SellAd[];
}