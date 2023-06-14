import React, { createContext, useState } from "react"
import { Notice, NoticeRequest } from "../types";
import { GetNoticesAPI, PostNoticeAPI } from "../services/DealFortressAPI";


type Props = {
    children: React.ReactNode
}

export const NoticesContext = createContext({});

export const NoticeProvider = ( { children } : Props) => {

    const [ notices, setNotices ] = useState<Notice[]>([]);

    const GetNotices = async () => {
        const response = await GetNoticesAPI();
        setNotices(response);
    }

    const PostNotice = async ( request: NoticeRequest ) => {
        const response = await PostNoticeAPI(request);
        setNotices( prevState => [response, ...prevState])
    }

  return (
    <NoticesContext.Provider value={{notices, GetNotices, PostNotice}}>
      { children }
    </NoticesContext.Provider>
  )
}
