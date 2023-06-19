import React, { createContext, useState } from "react"
import { Category, Notice, NoticeRequest, Product } from "../types";
import { getCategoriesAPI, getNoticesAPI, getProductsAPI, postNoticeAPI } from "../services/DealFortressAPI";
import { useQuery } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode
}

export const MarketContext = createContext({});

export const MarketProvider = ( { children } : Props) => {

    const noticesQuery = useQuery({
        queryKey: ['notices'],
        queryFn: getNoticesAPI
    });











  return (
    <MarketContext.Provider value={{noticesQuery}}>
      { children }
    </MarketContext.Provider>
  )
}
