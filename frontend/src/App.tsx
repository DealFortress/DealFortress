import { useContext, useEffect } from 'react'
import { Navbar } from './component/Navbar/Navbar'
import { MarketContextType} from './types'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import { NoticePage } from './pages/NoticePage'
import { NoticesIndex } from './pages/NoticesIndex'
import { Loader } from './component/General/Loader'
import { NoticeForm } from './pages/NoticeForm'
import { MarketContext } from './context/MarketProvider'
import { ErrorPage } from './pages/ErrorPage'


function App() {
  const { getMarketState, marketState } = useContext(MarketContext) as MarketContextType;


  const getData = async () => {
    getMarketState()
  }

  useEffect(() => {
    getData();
  }, [])

  const switchState = () => {

    switch (marketState.status) {
    case "LOADING":
      return (
        <Loader />
      )

    case "ERROR":
      return (
        <ErrorPage></ErrorPage>
      )

    case "OK":
      {const { notices } = marketState.data;

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
