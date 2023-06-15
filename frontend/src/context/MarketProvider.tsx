import React, { createContext, useState } from "react"
import { Category, Notice, NoticeRequest, Product } from "../types";
import { GetCategoriesAPI, GetNoticesAPI, GetProductsAPI, PostNoticeAPI } from "../services/DealFortressAPI";

type MarketStateLoading = {
    status: "LOADING",
};

type MarketStateError = {
    status: "ERROR",
    error: { code: string, message: string}
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

    const GetMarketState = async () => {
        const notices = await GetNotices();

        const products = await GetProducts();

        const categories = await GetCategories();
  
        if (marketState.status !== "ERROR") {
            console.log("bug")
            setMarketState({status: "OK", data:{ notices: notices, products: products, categories: categories}});
        }
    }


    const GetNotices = async () => {
        const response = await GetNoticesAPI();
        if ( response.status != 200) {
            console.log(response.status)
            setMarketState({status: "ERROR", error:{ code:(response.status).toString(), message:`Notice error: ${response.statusText}`}})
            return [];
        }
        return (await response.json()) as Notice[];
    }

    const GetProducts = async () => {
        const response = await GetProductsAPI();
        if ( response.status != 200) {
            console.log("error")
            setMarketState({status: "ERROR", error:{ code:(response.status).toString(), message:`Notice error: ${response.statusText}`}})
            return [];
        }
        return (await response.json()) as Product[];
    }

    const GetCategories = async () => {
        const response = await GetCategoriesAPI();
        if ( response.status != 200) {
            setMarketState({status: "ERROR", error:{ code:(response.status).toString(), message:`Notice error: ${response.statusText}`}})
            return [];
        }
        return (await response.json()) as Category[];
    }

    const PostNotice = async ( request: NoticeRequest ) => {
        const response = await PostNoticeAPI(request);
        if (marketState.status == "OK") {
            setMarketState({status: "OK", data:{ notices: [response, ...marketState.data.notices], products: marketState.data.products, categories:  marketState.data.categories}});
        }
    }

  return (
    <MarketContext.Provider value={{ GetMarketState, marketState, PostNotice}}>
      { children }
    </MarketContext.Provider>
  )
}
