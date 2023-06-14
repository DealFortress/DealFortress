// import React, { createContext, useState } from "react"
// import { Notice, NoticeRequest } from "../types";
// import { GetNoticesAPI, PostNoticeAPI } from "../services/DealFortressAPI";


// type Props = {
//     children: React.ReactNode
// }

// export const MarketContext = createContext({});

// export const MarketProvider = ( { children } : Props) => {

//     const [ notices, setNotices ] = useState<Notice[]>([]);

//     const GetNotices = async () => {
//         const response = await GetNoticesAPI();
//         setNotices(response);
//     }

//     const PostNotice = async ( request: NoticeRequest ) => {
//         const response = await PostNoticeAPI(request);
//         setNotices( prevState => [response, ...prevState])
//     }

//   return (
//     <MarketContext.Provider value={{notices, GetNotices, PostNotice}}>
//       { children }
//     </MarketContext.Provider>
//   )
// }
