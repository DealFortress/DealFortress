
// put in the env
const sellAdUrl = "https://localhost:5000/";

const GetSellAdsFromAPI = async () => {
    const response = await fetch(sellAdUrl);
    return await response.json() as SellAd[];
}