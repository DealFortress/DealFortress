import { useContext, useEffect} from 'react'
import './App.css'
import { Navbar } from './component/Navbar/Navbar'
// import { Footer } from './component/Footer'
import { GetCategoriesAPI, GetProductsAPI, GetNoticesAPI } from './services/DealFortressAPI'
import { Category, Product, Notice, MarketContextType} from './types'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import { NoticePage } from './pages/NoticePage'
import { NoticesIndex } from './pages/NoticesIndex'
import { Favourites } from './pages/Favourites'
import { Profile } from './pages/Profile'
import { Loader } from './component/General/Loader'
import { NoticeForm } from './pages/NoticeForm'
import { MarketContext } from './context/MarketProvider'


function App() {
  const { GetMarketState, marketState } = useContext(MarketContext) as MarketContextType;


  const GetData = async () => {
    GetMarketState()
  }

  useEffect(() => {
    GetData();
  }, [])

  const switchState = () => {

    switch (marketState.status) {
    case "LOADING":
      return (
        <Loader />
      )

    case "ERROR":
      return (
        <p>error</p>
      )

    case "OK":
      {const { notices } = marketState.data;

      return (
            <Routes>
              <Route path="/notices" element={ <NoticesIndex notices={notices}/> }/>
              {/* try to only send one sell ad */}
              <Route path="/notices/:id" element={ <NoticePage notices={notices}/> }/>
              <Route path="/favourites" element={ <Favourites/> }/>
              <Route path="/profile" element={ <Profile/> }/>
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
        {/* <Footer /> */}
        </BrowserRouter>
    </>
  )
}


export default App
