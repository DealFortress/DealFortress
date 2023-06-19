import React, { createContext } from "react"
import { getCategoriesAPI, getNoticesAPI } from "../services/DealFortressAPI";
import { useQuery } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode
}

export const MarketContext = createContext({});

export const MarketProvider = ( { children } : Props) => {

    const noticesQuery = useQuery({
      queryKey: ["notices"],
      queryFn: getNoticesAPI
    });

    const categoriesQuery = useQuery({
      queryKey: ["categories"],
      queryFn: getCategoriesAPI
    });


  return (
    <MarketContext.Provider value={{noticesQuery, categoriesQuery}}>
      { children }
    </MarketContext.Provider>
  )
}
