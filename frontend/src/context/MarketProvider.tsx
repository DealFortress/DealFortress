import React, { createContext, useState } from "react"
import { Category, Notice, NoticeRequest, Product } from "../types";
import { getCategoriesAPI, getNoticesAPI, getProductsAPI, postNoticeAPI } from "../services/DealFortressAPI";

type MarketStateLoading = {
    status: "LOADING",
};

type MarketStateError = {
    status: "ERROR",
    error: { code: number, message: string}
};

type MarketStateOk = {
    status: "OK",
    data: { notices: Notice[], products: Product[], categories: Category[]}
};

type Props = {
    children: React.ReactNode
}


export type MarketState = MarketStateLoading | MarketStateError | MarketStateOk;


export const MarketContext = createContext({});

export const MarketProvider = ( { children } : Props) => {

    const [ marketState, setMarketState ] = useState<MarketState>({status: "LOADING"})

    const getMarketState = async () => {
        const notices = await getNotices();

        const products = await getProducts();

        const categories = await getCategories();
  
        if (marketState.status !== "ERROR" && notices.length != 0 && products.length != 0 && categories.length != 0) {
            setMarketState({status: "OK", data:{ notices: notices, products: products, categories: categories}});
        }
    }


    const getNotices = async () => {
        const response = await getNoticesAPI();
        if ( response.status != 200) {
            console.log(response.status)
            setMarketState({status: "ERROR", error:{ code:(response.status), message:`Notice error: ${response.statusText}`}})
            return [];
        }
        return (await response.json()) as Notice[];
    }

    const getProducts = async () => {
        const response = await getProductsAPI();
        if ( response.status != 200) {
            console.log("error")
            setMarketState({status: "ERROR", error:{ code:(response.status), message:`Notice error: ${response.statusText}`}})
            return [];
        }
        return (await response.json()) as Product[];
    }

    const getCategories = async () => {
        const response = await getCategoriesAPI();
        if ( response.status != 200) {
            setMarketState({status: "ERROR", error:{ code:(response.status), message:`Notice error: ${response.statusText}`}})
            return [];
        }
        return (await response.json()) as Category[];
    }

    const postNotice = async ( request: NoticeRequest ) => {
        const response = await postNoticeAPI(request);
        if (marketState.status == "OK") {
            setMarketState({status: "OK", data:{ notices: [response, ...marketState.data.notices], products: marketState.data.products, categories:  marketState.data.categories}});
        }
    }



  return (
    <MarketContext.Provider value={{ getMarketState, marketState, postNotice}}>
      { children }
    </MarketContext.Provider>
  )
}
