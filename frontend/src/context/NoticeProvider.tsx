import React, { createContext, useState } from "react"
import { Category, Notice, NoticeRequest, Product } from "../types";
import { GetNoticesAPI, GetProductsAPI, PostNoticeAPI } from "../services/DealFortressAPI";

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

    const [ notices, setNotices ] = useState<Notice[]>([]);
    const [ marketState, setMarketState ] = useState<MarketState>({status: "LOADING"})

    const GetMarketState = () => {
        return 'atteselect';
        // setMarketState({status: "OK", data:{ notices: notices, products: , categories: }});
    }


    const GetNotices = async () => {
        const response = await GetNoticesAPI();
        if ( response.status != 200) {
            setMarketState({status: "ERROR", error:{ code:(response.status).toString(), message:`Notice error: ${response.statusText}`}})
            return;
        }
        return (await response.json()) as Notice[];
    }

    // const GetProduct = async () => {
    //     const response = await GetNoticesAPI();
    //     if ( response.status != 200) {
    //         setMarketState({status: "ERROR", error:{ code:(response.status).toString(), message:`Notice error: ${response.statusText}`}})
    //         return;
    //     }
    //     return (await response.json()) as Notice[];
    // }

    // const GetNotices = async () => {
    //     const response = await GetNoticesAPI();
    //     if ( response.status != 200) {
    //         setMarketState({status: "ERROR", error:{ code:(response.status).toString(), message:`Notice error: ${response.statusText}`}})
    //         return;
    //     }
    //     return (await response.json()) as Notice[];
    // }

    const PostNotice = async ( request: NoticeRequest ) => {
        const response = await PostNoticeAPI(request);
        setNotices( prevState => [response, ...prevState])
    }

  return (
    <MarketContext.Provider value={{notices, GetNotices, PostNotice}}>
      { children }
    </MarketContext.Provider>
  )
}
