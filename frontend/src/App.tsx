import { Navbar } from './component/Navbar/Navbar'
import { Notice } from './types'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from './component/General/Loader'
import { ErrorPage } from './pages/ErrorPage'
import { NotFound } from './pages/NotFound'
import { NoticeForm } from './pages/NoticeForm'
import { NoticePage } from './pages/NoticePage'
import { NoticesIndex } from './pages/NoticesIndex'
import { GetNoticesQuery } from './services/DealFortressQueries'
import { useAuth0 } from '@auth0/auth0-react'


export const App = () => {
  const { isLoading } = useAuth0()
  const { getAccessTokenSilently } = useAuth0();
  const token = getAccessTokenSilently();
  const { data: noticeData, status: noticeStatus } = GetNoticesQuery(token);

  const switchState = () => {

    switch (noticeStatus) {
    case "loading":
      return (
        <Loader />
      )

    case "error":
      return (
        <ErrorPage />
      )

    case "success":
      {const  notices  = noticeData as Notice[] ;

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

  if (isLoading) { 
    return <Loader />; 
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
