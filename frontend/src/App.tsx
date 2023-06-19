import { useContext } from 'react'
import { Navbar } from './component/Navbar/Navbar'
import { MarketContextType, Notice } from './types'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from './component/General/Loader'
import { ErrorPage } from './pages/ErrorPage'
import { NotFound } from './pages/NotFound'
import { NoticeForm } from './pages/NoticeForm'
import { NoticePage } from './pages/NoticePage'
import { NoticesIndex } from './pages/NoticesIndex'
import { noticesQuery } from './services/DealFortressQueries'




export const App = () => {


  const switchState = () => {
    const { data, status } = noticesQuery();

    switch (status) {
    case "loading":
      return (
        <Loader />
      )

    case "error":
      return (
        <ErrorPage />
      )

    case "success":
      {const  notices  = data as Notice[] ;

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



