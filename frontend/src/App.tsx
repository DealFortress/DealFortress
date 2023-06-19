import { useContext, useEffect } from 'react'
import { Navbar } from './component/Navbar/Navbar'
import { MarketContextType, Notice } from './types'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MarketContext } from './context/MarketProvider'
import { Loader } from './component/General/Loader'
import { ErrorPage } from './pages/ErrorPage'
import { NotFound } from './pages/NotFound'
import { NoticeForm } from './pages/NoticeForm'
import { NoticePage } from './pages/NoticePage'
import { NoticesIndex } from './pages/NoticesIndex'




function App() {
  const { noticeQuery } = useContext(MarketContext) as MarketContextType;

  const switchState = () => {
    switch (noticeQuery.status) {
    case "loading":
      return (
        <Loader />
      )

    case "error":
      return (
        <ErrorPage />
      )

    case "success":
      {const  notices  = noticeQuery.data as Notice[] ;

      return (
            <Routes>
              <Route path="/notices" element={ <NoticesIndex notices={notices}/> }/>
              {/* try to only send one sell ad */}
              <Route path="/notices/:id" element={ <NoticePage notices={notices}/> }/>
              <Route path="/createnotice" element={ <NoticeForm/> }/>
              <Route path="/" element={ <NoticesIndex notices={notices}/> }/>
              <Route path="*" element={ <NotFound/> }/>
            </Routes>
        )
      }
    }
  }


  return (
    <>
        <BrowserRouter>
          <Navbar />
          { switchState() }
        </BrowserRouter>
    </>
  )
}


export default App
