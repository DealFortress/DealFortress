// import React, { createContext, useState } from "react"
// import { Notice, NoticeRequest } from "../types";
// import { getNoticesAPI, postNoticeAPI } from "../services/DealFortressAPI";


// type Props = {
//     children: React.ReactNode
// }

// export const MarketContext = createContext({});

// export const MarketProvider = ( { children } : Props) => {

//     const [ notices, setNotices ] = useState<Notice[]>([]);

//     const getNotices = async () => {
//         const response = await getNoticesAPI();
//         setNotices(response);
//     }

//     const postNotice = async ( request: NoticeRequest ) => {
//         const response = await postNoticeAPI(request);
//         setNotices( prevState => [response, ...prevState])
//     }

//   return (
//     <MarketContext.Provider value={{notices, getNotices, postNotice}}>
//       { children }
//     </MarketContext.Provider>
//   )
// }
